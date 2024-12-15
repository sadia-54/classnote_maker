// const blobToBase64 = (blob: Blob, callback: (base64data: string) => void): void => {
//   const reader = new FileReader();

//   reader.onload = function () {
//     const base64data = reader.result?.toString().split(",")[1];
//     if (base64data) {
//       callback(base64data);
//     } else {
//       console.error("Failed to convert blob to base64.");
//     }
//   };

//   reader.onerror = function () {
//     console.error("Error reading the Blob.");
//   };

//   try {
//     reader.readAsDataURL(blob);
//   } catch (error) {
//     console.error("Error converting Blob to Base64:", error);
//   }
// };

// export { blobToBase64 };
export const blobToBase64 = (blob: Blob, callback: (base64: string) => void) => {
  const reader = new FileReader();

  reader.onloadend = () => {
    if (reader.result) {
      const base64data = reader.result as string;
      callback(base64data);
    } else {
      console.error("Failed to convert blob to base64");
    }
  };

  reader.onerror = (error) => {
    console.error("Error reading blob", error);
  };

  reader.readAsDataURL(blob);
};
