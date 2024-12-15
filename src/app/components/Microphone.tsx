// --- client-side component ---
"use client";

import { useRecordVoice } from "@/hooks/useRecordVoice";
import { useState } from "react";
import MicIcon from "@mui/icons-material/Mic";
import { Button } from "@mui/material";

interface TranscriptionResponse {
  results?: {
    alternatives?: { transcript: string }[];
  }[];
}

const Microphone = () => {
  const { startRecording, stopRecording, audioBlob } = useRecordVoice();
  const [transcription, setTranscription] = useState<string>("");

  const handleTranscription = async () => {
    if (!audioBlob) {
      console.error("No audio recorded.");
      setTranscription("No audio recorded.");
      return;
    }

    console.log("Audio Blob: ", audioBlob); // Log the audioBlob to see its content

    const reader = new FileReader();

    // Handle file reading and potential errors
    reader.onloadend = async () => {
      if (!reader.result) {
        console.error("Failed to read the audio file.");
        setTranscription("Failed to read the audio file.");
        return;
      }

      const base64Audio = reader.result.toString().split(",")[1];
      console.log("Base64 Audio: ", base64Audio); // Log the base64 audio string

      if (!base64Audio) {
        console.error("Failed to convert audio to base64.");
        setTranscription("Failed to convert audio to base64.");
        return;
      }

      try {
        const response = await fetch("/api/transcribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ audio: base64Audio }),
        });

        if (!response.ok) {
          console.error("Error from server:", response.statusText);
          setTranscription("Error in transcription.");
          return;
        }

        const data: TranscriptionResponse = await response.json();
        setTranscription(data.results?.[0]?.alternatives?.[0]?.transcript ?? "No transcription available.");
      } catch (error) {
        console.error("Error calling transcription API:", error);
        setTranscription("Error occurred while transcribing.");
      }
    };

    // Trigger the file reading process
    reader.readAsDataURL(audioBlob);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Button
        variant="contained"
        color="primary"
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        startIcon={<MicIcon />}
        className="w-20 h-20"
      >
        {audioBlob ? "Stop Recording" : "Start Recording"}
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleTranscription}
        className="mt-4"
      >
        Transcribe Audio
      </Button>

      <p>{transcription}</p>
    </div>
  );
};

export { Microphone };
