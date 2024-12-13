
"use client";

import React, { useState, useRef, useEffect } from 'react';

const SpeechToTextPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const recognition = useRef<SpeechRecognition | null>(null);

  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        const recognizedText = result[0].transcript;
        setTranscript(recognizedText);
      };

      recognition.current.onerror = (event: any) => {
        console.error('Speech Recognition Error: ', event.error);
      };
    } else {
      console.error('SpeechRecognition API is not supported in this browser.');
    }
  };

  const startRecording = () => {
    if (recognition.current) {
      recognition.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    initializeSpeechRecognition();
  }, []);

  return (
    <div>
      <h1>Speech to Text</h1>
      <button onClick={toggleRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      <div>
        <h2>Recognized Text</h2>
        <p>{transcript}</p>
      </div>
    </div>
  );
};

export default SpeechToTextPage;
