import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow-models/mobilenet'; // Import MobileNet model
import './SmartWaste.css';

// Function to load the model (MobileNet)
const loadModel = async () => {
  try {
    const model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json');
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
  const [model, setModel] = useState(null); // Model state

  // Load MobileNet model once when the component mounts
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

  // Function to handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Create a temporary object URL for the uploaded file
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);

      const img = new Image();
      img.src = imageUrl;
      img.onload = async () => {
        setLoading(true);
        try {
          // Make a prediction once the image is loaded
          const prediction = await classifyImage(img);
          setPrediction(prediction);
        } catch (error) {
          console.error('Error during image classification:', error);
          setPrediction('Error classifying image. Please try again.');
        }
        setLoading(false);
      };
    } else {
      // Clear image if user cancels upload
      setImage(null);
      setPrediction('');
    }
  };

  // Function to classify the image
  const classifyImage = async (image) => {
    if (model) {
      // Preprocess the image to fit the model input size (224x224)
      const tensor = tf.browser.fromPixels(image)
        .resizeBilinear([224, 224])  // Resize to 224x224 (expected input for MobileNet)
        .expandDims(0)  // Add batch dimension
        .toFloat()
        .div(tf.scalar(255));  // Normalize image

      // Get predictions from the model
      const predictions = await model.predict(tensor).data();

      // Find the index of the highest probability
      const maxPredictionIndex = predictions.indexOf(Math.max(...predictions));

      // Map the top prediction index to your categories (Recyclable, Biodegradable, Non-biodegradable)
      const mappedLabels = ['Biodegradable', 'Non-biodegradable', 'Recyclable'];
      const predictionResult = mappedLabels[maxPredictionIndex % mappedLabels.length];

      // Implement a threshold (50% confidence, for example)
      const threshold = 0.5;
      if (Math.max(...predictions) < threshold) {
        return 'Uncertain. Please try another image.';
      }

      return `${predictionResult} (${Math.round(Math.max(...predictions) * 100)}%)`;
    }
    return 'Error: Model not loaded yet.';
  };

  return (
    <div className="smart-waste-wrapper">
      <div className="left-column">
        <div className="mascot-image-box">
          <img src="/mascot.jpg" alt="Eco Mascot" />
          <p className="mascot-tip">"Keep it clean, keep it green!"</p>
        </div>
      </div>

      <div className="right-column">
        <div className="smart-waste-container">
          <h1>Smart Waste Segregation</h1>
          <p>Upload a photo of your trash, and we’ll tell you which bin to use.</p>

          <div className="upload-section">
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image && <img src={image} alt="Uploaded trash" width="200" />}
            {loading && <p className="loading">Classifying...</p>}
          </div>

          {prediction && (
            <div className="result">
              <h2>Suggested Bin: {prediction}</h2>
            </div>
          )}

          <div className="eco-tips">
            <h3>Eco Tips:</h3>
            <p>Make sure to always segregate your recyclables properly to help the environment!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmartWaste;
