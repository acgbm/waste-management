import React, { useState } from "react";
import { auth, db } from "../firebaseConfig"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; 
import logo from "../assets/logo.png"; 

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email,
        address,
        phone,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      });

      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err.code, err.message);

      // Firebase error handling
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered. Try logging in.");
          break;
        case "auth/weak-password":
          setError("Password must be at least 6 characters long.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        default:
          setError("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="animated-bg"></div>
      <div className="signup-box">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSignup}>
          <div className="form-row">
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <div className="form-row">
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default Signup;
