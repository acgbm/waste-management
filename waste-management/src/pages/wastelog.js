import React, { useState, useRef } from "react";
import { db, storage } from "../firebaseConfig.js";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./wastelog.css"; // Make sure this points to your actual CSS file

const WasteLog = () => {
  const [form, setForm] = useState({
    date: "",
    type: "",
    weight: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null); // to reset file input manually

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { date, type, weight, image } = form;
    if (!date || !type || !weight || !image) return alert("Fill all fields");

    setLoading(true);
    try {
      const imgRef = ref(storage, `wasteProofs/${Date.now()}_${image.name}`);
      await uploadBytes(imgRef, image);
      const imageUrl = await getDownloadURL(imgRef);

      await addDoc(collection(db, "wasteLogs"), {
        date,
        type,
        weight: parseFloat(weight),
        imageUrl,
        status: "pending",
        createdAt: Timestamp.now(),
      });

      alert("Waste log submitted!");
      setForm({ date: "", type: "", weight: "", image: null });
      fileInputRef.current.value = null; // reset file input
    } catch (err) {
      console.error(err);
      alert("Error submitting log.");
    }
    setLoading(false);
  };

  return (
    <div className="waste-form-container">
      <h2>Submit Waste Log</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <select
          className="form-control"
          name="type"
          value={form.type}
          onChange={handleChange}
          required
        >
          <option value="">Select Waste Type</option>
          <option value="Recyclable">♻Recyclable</option>
          <option value="Biodegradable">🍃Biodegradable</option>
          <option value="Residual">🗑Non-Biodegradable</option>
        </select>
        <input
          className="form-control"
          type="number"
          name="weight"
          value={form.weight}
          onChange={handleChange}
          placeholder="Weight (kg)"
          required
        />
        <input
          className="form-control"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          ref={fileInputRef}
          required
        />
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default WasteLog;
