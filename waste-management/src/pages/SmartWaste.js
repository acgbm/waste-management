import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow-models/mobilenet';
import './SmartWaste.css';

const loadModel = async () => {
  try {
    const model = await tf.loadLayersModel(
      'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json'
    );
    return model;
  } catch (error) {
    console.error("Error loading model:", error);
    throw error;
  }
};

function SmartWaste() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadMobileNet = async () => {
      setLoading(true);
      try {
        const loadedModel = await loadModel();
        setModel(loadedModel);
      } catch (error) {
        console.error('Error loading model:', error);
      }
      setLoading(false);
    };

    loadMobileNet();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      classify(imageUrl);
    }
  };

  const classify = (imageUrl) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = async () => {
      setLoading(true);
      try {
        const result = await classifyImage(img);
        setPrediction(result);
      } catch (err) {
        console.error('Classification failed:', err);
        setPrediction('Error classifying image.');
      }
      setLoading(false);
      setShowModal(true); // Show modal after prediction
    };
  };

  const classifyImage = async (image) => {
    if (!model) return 'Model not loaded.';

    const tensor = tf.browser.fromPixels(image)
      .resizeBilinear([224, 224])
      .expandDims(0)
      .toFloat()
      .div(tf.scalar(255));

    const predictions = await model.predict(tensor).data();
    const maxIdx = predictions.indexOf(Math.max(...predictions));

    const labels = ['Biodegradable', 'Non-biodegradable', 'Recyclable'];
    const result = labels[maxIdx % labels.length];

    const threshold = 0.5;
    if (Math.max(...predictions) < threshold) {
      return 'Uncertain. Try a clearer image.';
    }

    return `${result} (${Math.round(Math.max(...predictions) * 100)}%)`;
  };

  const startCamera = async () => {
    setCameraOpen(true);
    setPrediction('');
    setImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access denied:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOpen(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = 224;
      canvas.height = 224;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/png');
      setImage(dataUrl);
      classify(dataUrl);
      stopCamera();
    }
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
  };

  const captureAgain = () => {
    setPrediction(''); // Reset prediction
    setImage(null); // Reset image
    setShowModal(false); // Close modal to allow re-capture
    startCamera(); // Restart camera
  };

  return (
    <div className="smart-waste-wrapper">
      <div className="mascot-column">
        <div className="mascot-image-box">
          <img src="/mascot.jpg" alt="Eco Mascot" />
          <p className="mascot-tip">"Keep it clean, keep it green!"</p>
        </div>
      </div>

      <div className="main-column">
        <div className="smart-waste-container">
          <h1>Smart Waste Segregation</h1>
          <p>Upload a photo or use your camera to identify the waste type.</p>

          <div className="input-section-row">
            {/* File Upload Section */}
            <div className="upload-section">
              <h2>Upload Your Waste Image</h2>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </div>

            {/* Camera Section */}
            <div className="camera-section-wrapper">
              <h2 className="camera-section-title">Or Capture Using Camera</h2>
              {!cameraOpen ? (
                <button onClick={startCamera}>Open Camera</button>
              ) : (
                <div className="camera-section">
                  <video ref={videoRef} autoPlay playsInline width="300" />
                  <div className="camera-buttons">
                    <button onClick={captureImage}>Capture</button>
                    <button onClick={stopCamera}>Cancel</button>
                  </div>
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
              )}
            </div>
          </div>

          {image && (
            <div className="preview-image">
              <img src={image} alt="Preview" width="250" />
            </div>
          )}

          {loading && <p className="loading">Classifying...</p>}
        </div>
      </div>

      {/* Modal for Result */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Prediction Result</h2>
            <p>{prediction}</p>
            {prediction === 'Uncertain. Try a clearer image.' && (
              <button onClick={captureAgain} className="capture-again-btn">Capture Again</button>
            )}
            <button onClick={closeModal} className="modal-close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartWaste;
