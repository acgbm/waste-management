import * as tf from '@tensorflow/tfjs';

// Load a pre-trained model (MobileNet as an example)
export const loadModel = async () => {
  const model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224/model.json');
  return model;
};

// Function to handle image upload (for now, just log the file or handle as needed)
export const uploadImage = async (file) => {
  try {
    // Logic to upload image (e.g., Firebase or custom storage)
    console.log('Uploading image:', file);
    // Simulate successful upload
    return 'Image uploaded successfully!';      
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Function to classify the trash (using TensorFlow.js)
export const classifyTrash = async (file) => {
    try {
      const imageElement = document.createElement('img');
      imageElement.src = URL.createObjectURL(file);
  
      // Wait until the image is fully loaded
      await new Promise((resolve) => { imageElement.onload = resolve; });
  
      // Load the model
      const model = await loadModel();
  
      // Preprocess the image to the size expected by the model
      const tensor = tf.browser.fromPixels(imageElement).resizeBilinear([224, 224]).expandDims(0).toFloat().div(tf.scalar(255));
  
      // Classify the image
      const predictions = await model.predict(tensor).data();
  
      // You will need to map the 1000 predictions to your 3 categories
      // Here, we just return the first prediction (replace with actual logic)
      const maxPredictionIndex = predictions.indexOf(Math.max(...predictions));
      
      // Here is a placeholder. You need to map predictions to your classes (Biodegradable, Non-bio, Recyclable)
      const mappedLabels = ['Biodegradable', 'Non-biodegradable', 'Recyclable'];
  
      // You can either choose the highest confidence class or map from your categories
      const predictionResult = mappedLabels[maxPredictionIndex % mappedLabels.length]; // Modulo to map to 3 categories
      return predictionResult;
    } catch (error) {
      console.error('Error classifying trash:', error);
      throw error;
    }
  };
  