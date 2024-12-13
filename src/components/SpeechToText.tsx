import { useState, useRef } from 'react';

export default function SpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleRecord = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      // Start recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
        setAudioFile(file);
      };
       mediaRecorder.start();
      setIsRecording(true);
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleConvertToText = async () => {
    if (!audioFile) {
      alert("Please upload or record an audio file first.");
      return;
    }
    
    const formData = new FormData();
    formData.append('audio', audioFile);
     try {
      const response = await fetch('/api', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setTranscription(data.transcription);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleRecord}
        className={`w-full py-2 text-white ${isRecording ? 'bg-red-500' : 'bg-blue-500'} rounded-md`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
       <input 
        type="file" 
        accept="audio/*" 
        onChange={handleUpload} 
        className="w-full bg-gray-100 py-2 px-4 rounded-md border border-gray-300"
      />
      
      <button 
        onClick={handleConvertToText} 
        className="w-full py-2 bg-green-500 text-white rounded-md"
      >
        Convert to Text
      </button>

      {transcription && (
        <div className="bg-gray-100 p-4 rounded-md mt-4">
          <h2 className="font-bold">Transcription:</h2>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
}