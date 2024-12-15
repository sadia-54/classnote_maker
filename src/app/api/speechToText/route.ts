// --- server-side API handler --- 
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import fetch from "node-fetch"; // Import node-fetch for server-side HTTP requests

dotenv.config();

const gcpApiKey = process.env.GCP_API_KEY as string; // GCP API Key from .env file

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const base64Audio = body.audio;
    
    if (!base64Audio) {
      return NextResponse.json({ error: "Audio data is missing" }, { status: 400 });
    }

    // Convert base64 to Buffer (audio data)
    const audioBuffer = Buffer.from(base64Audio, "base64");
    const filePath = path.join("tmp", "input.wav");

    // Create the tmp directory if it does not exist
    if (!fs.existsSync("tmp")) {
      fs.mkdirSync("tmp");
    }

    // Write the audio file to disk temporarily
    fs.writeFileSync(filePath, audioBuffer);

    const fileData = fs.readFileSync(filePath);

    // Send the audio data to Google's Speech API for transcription
    const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${gcpApiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        config: {
          encoding: "LINEAR16", // Audio encoding (ensure it matches your audio format)
          languageCode: "en-US", // Language of the audio
        },
        audio: {
          content: fileData.toString("base64"), // Send audio content as base64
        },
      }),
    });

    const transcriptionData = await response.json();
    
    // Clean up: remove the temporary audio file after use
    fs.unlinkSync(filePath);

    return NextResponse.json(transcriptionData);
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.json({ error: "Failed to process the audio." }, { status: 500 });
  }
}
