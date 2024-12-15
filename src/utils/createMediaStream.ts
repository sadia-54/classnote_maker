// const getPeakLevel = (analyzer: AnalyserNode): number => {
//   const array = new Uint8Array(analyzer.fftSize);
//   analyzer.getByteTimeDomainData(array);
//   return (
//     array.reduce((max, current) => Math.max(max, Math.abs(current - 127)), 0) / 128
//   );
// };

// const createMediaStream = (
//   stream: MediaStream,
//   isRecording: boolean,
//   callback: (peak: number) => void
// ): (() => void) => { // Now returns a cleanup function to stop the recording
//   const context = new AudioContext();
//   const source = context.createMediaStreamSource(stream);
//   const analyzer = context.createAnalyser();
//   source.connect(analyzer);

//   const tick = () => {
//     if (!isRecording) {
//       return; // Stop processing if not recording
//     }

//     const peak = getPeakLevel(analyzer);
//     callback(peak); // Send peak value to the callback
//     requestAnimationFrame(tick); // Continue calling tick
//   };

//   tick();

//   // Cleanup function to stop the recording and close the context
//   return () => {
//     context.close();
//   };
// };

// export { createMediaStream };

export const createMediaStream = (stream: MediaStream, isRecording: boolean, onStart: () => void) => {
  if (isRecording) {
    console.log("MediaStream created and recording started");
    onStart();
  } else {
    console.warn("MediaStream not started");
  }
};
