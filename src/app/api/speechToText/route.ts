import { IncomingMessage, ServerResponse } from 'http';
import formidable, { Fields, File, Files } from 'formidable';
import fs from 'fs';
import axios from 'axios';
import { NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser to handle form data manually
  },
};

const handler = async (req: IncomingMessage, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err: Error | null, fields: Fields, files: Files<string>) => {
    if (err) {
      res.status(400).json({ error: 'Error parsing the form data' });
      return;
    }

    // Ensure an audio file is uploaded
    if (!files.audio) {
      res.status(400).json({ error: 'No audio file uploaded' });
      return;
    }

    const file = Array.isArray(files.audio) ? files.audio[0] : files.audio; // Handle single/multiple file uploads
    const filePath = file.filepath;

    try {
      // Send the audio file to Google Cloud Speech-to-Text API
      const apiKey = process.env.GCP_API_KEY; // Store your API key in .env
      const audioData = fs.readFileSync(filePath);
      const response = await axios.post(
        `https://speech.googleapis.com/v1p1beta1/speech:recognize?key=${apiKey}`,
        {
          config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
          },
          audio: {
            content: audioData.toString('base64'),
          },
        }
      );

      const text = response.data.results
        .map((result: any) => result.alternatives[0].transcript)
        .join(' ');

      res.status(200).json({ text });
    } catch (error) {
      console.error('Error during speech-to-text processing', error);
      res.status(500).json({ error: 'Error converting audio to text' });
    }
  });
};

export default handler;
