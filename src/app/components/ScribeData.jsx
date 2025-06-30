"use client";
import React, { useState, useEffect } from "react";
import Tesseract from "tesseract.js";

export default function ScribeData() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!selectedImage)
      return;

    const ocrWork = async () => {
      try {
        setLoading(true)
        const worker = await Tesseract.createWorker("eng", 1, {
          logger: (m) => {

            if (m.status === "recognizing text")
              setProgress(Math.round(m.progress * 100));

          }
        });

        const { data: { text }, } = await worker.recognize(selectedImage);
        setOcrText(text)
        // console.log(text)
        worker.terminate();
      }
      catch (e) {
        console.log("Error:", e);
        setOcrText("");
      }
      finally {
        setLoading(false);
        setProgress(0);

      }

    };
    ocrWork();

  }, [selectedImage])



  const handleImageChange = (event) => {
    const file = event.target.files[0];
    // console.log(URL.createObjectURL(file))
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setOcrText(''); // Clear previous OCR text
      setError('');   // Clear previous errors
      setProgress(0)
    } else {
      setSelectedImage(null);
    }
  };


  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-2xl">Upload Image Here</h1>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-10 text-center"
        />
      </div>
      <div>
        {selectedImage ?
          <div>
            <img src={selectedImage} alt="uploadedImage"
              style={{ maxWidth: '20%', height: 'auto', display: 'block', margin: '0 auto' }} />

            {ocrText ?
              <div className="flex flex-col items-center">
                <div className="flex justify-center mt-5">
                  <h1 className="font-bold text-2xl my-5">Output:</h1>
                </div>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '1rem', lineHeight: '1.5' }}>
                  {ocrText}
                </pre>
              </div>
              : <div>
                {loading ?
                  <div className="flex flex-col items-center mt-10">
                    <p className="font-bold">Progress: </p>{progress}%
                  </div>
                  :
                  <div>
                  </div>}
              </div>}
          </div>
          : <div>

          </div>}
      </div>

    </div>
  );
}
