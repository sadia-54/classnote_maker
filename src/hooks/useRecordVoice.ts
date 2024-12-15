import { useEffect, useState, useRef } from "react";
import { blobToBase64 } from "@/utils/blobToBase64";
import { createMediaStream } from "@/utils/createMediaStream";

export const useRecordVoice = () => {
  const [text, setText] = useState<string>("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const isRecording = useRef<boolean>(false);
  const chunks = useRef<Blob[]>([]);

  const startRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "recording") {
      console.log("Start Recording");
      isRecording.current = true;
      mediaRecorder.start();
      setRecording(true); // Update state to show recording in progress
      console.log("Recording started");
    } else {
      console.warn("Already recording or mediaRecorder not ready.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      console.log("Stop Recording");
      isRecording.current = false;
      mediaRecorder.stop();
      setRecording(false); // Update state to indicate recording has stopped
      console.log("Recording stopped");
    } else {
      console.warn("Recording already stopped or mediaRecorder not ready.");
    }
  };

  const getText = async (base64data: string) => {
    try {
      const response = await fetch("/api/speechToText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audio: base64data }),
      });
      
      const { text } = await response.json();
      console.log("Transcribed text:", text);
      setText(text);
    } catch (error) {
      console.error("Error transcribing:", error);
    }
  };

  const initialMediaRecorder = (stream: MediaStream) => {
    const recorder = new MediaRecorder(stream);

    recorder.onstart = () => {
      console.log("MediaRecorder started");
      createMediaStream(stream, isRecording.current, () => {
        chunks.current = [];
      });
    };

    recorder.ondataavailable = (ev) => {
      console.log("Data available", ev.data);
      chunks.current.push(ev.data);
    };

    recorder.onstop = () => {
      console.log("MediaRecorder stopped");
      const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
      console.log("Audio Blob Size:", audioBlob.size);
      if (audioBlob.size > 0) {
        setAudioBlob(audioBlob);
        blobToBase64(audioBlob, getText);
      } else {
        console.error("No audio recorded.");
      }
    };

    setMediaRecorder(recorder);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          console.log("Audio stream created");
          initialMediaRecorder(stream);
        })
        .catch((error) => {
          console.error("Error accessing media devices", error);
        });
    }

    // Cleanup on unmount: stop the recorder and release the stream
    return () => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        console.log("Cleanup: Stopping media recorder");
        mediaRecorder.stop();
      }
    };
  }, []); // Empty dependency to only run on component mount

  return { recording, startRecording, stopRecording, text, audioBlob };
};
