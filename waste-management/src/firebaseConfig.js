import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // 🔥 Add this

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZClFUWSL0Y6j7-lssiEIjpe_E3b0Sgoo",
  authDomain: "waste-management-daca6.firebaseapp.com",
  projectId: "waste-management-daca6",
  storageBucket: "waste-management-daca6.appspot.com", // 🔁 Fix: should be .**appspot.com**
  messagingSenderId: "940836531005",
  appId: "1:940836531005:web:a6e34046373b0aeae6b354"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Add this line

export { auth, db, storage }; // ✅ Export it
