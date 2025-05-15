// Import required Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // 🔥 Add this

// Supabase Setup
import { createClient } from '@supabase/supabase-js';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAZClFUWSL0Y6j7-lssiEIjpe_E3b0Sgoo",
  authDomain: "waste-management-daca6.firebaseapp.com",
  projectId: "waste-management-daca6",
  storageBucket: "waste-management-daca6.appspot.com", // 🔁 Fix: should be .**appspot.com**
  messagingSenderId: "940836531005",
  appId: "1:940836531005:web:a6e34046373b0aeae6b354"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Add this line

// Export the services for use in other parts of the app
export { auth, db, storage }; // ✅ Export it

// ================= Supabase ================= //
const supabaseUrl = 'https://yxghpfmbgsztaxrszrvo.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4Z2hwZm1iZ3N6dGF4cnN6cnZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNzcxNzAsImV4cCI6MjA2Mjg1MzE3MH0.GkKtIbhy25XPheX4g26d5O_H5uvpVr55_o35ongaego'; // Replace with your Supabase Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);