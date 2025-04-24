import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, query, orderBy, getDocs } from 'firebase/firestore';
import './wastelog.css';

const EcoImpactTracker = () => {
  const [paper, setPaper] = useState(0);
  const [plastic, setPlastic] = useState(0);
  const [foodWaste, setFoodWaste] = useState(0);
  const [ecoImpact, setEcoImpact] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      const q = query(collection(db, "wastelog"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const historyData = querySnapshot.docs.map(doc => doc.data());
      setHistory(historyData);
    } catch (error) {
      setError("Error fetching history: " + error.message);
    }
  };

  const calculateEcoImpact = async () => {
    const treesSaved = paper * 17;
    const co2Reduced = plastic * 3.5;
    const waterSaved = plastic * 3.5;

    setEcoImpact({ treesSaved, co2Reduced, waterSaved });

    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, "wastelog"), {
          userId: user.uid,
          paper,
          plastic,
          foodWaste,
          treesSaved,
          co2Reduced,
          waterSaved,
          timestamp: new Date(),
        });
        fetchHistory();
      }
    } catch (error) {
      setError("Error saving your data: " + error.message);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="wastelog">
      <div className="wastelog__form-section">
        <h2 className="wastelog__title">Eco-Impact Tracker</h2>
        <p className="wastelog__subtitle">Track your recycling and waste reduction impact!</p>

        <div className="wastelog__input-group">
          <label>Recycled Paper (kg):</label>
          <input
            type="number"
            value={paper}
            onChange={(e) => setPaper(e.target.value)}
          />
        </div>

        <div className="wastelog__input-group">
          <label>Recycled Plastic (kg):</label>
          <input
            type="number"
            value={plastic}
            onChange={(e) => setPlastic(e.target.value)}
          />
        </div>

        <div className="wastelog__input-group">
          <label>Composted Food Waste (kg):</label>
          <input
            type="number"
            value={foodWaste}
            onChange={(e) => setFoodWaste(e.target.value)}
          />
        </div>

        <button className="wastelog__button" onClick={calculateEcoImpact}>
          Calculate My Impact
        </button>

        {ecoImpact && (
          <div className="wastelog__results">
            <h3>Your Eco-Impact:</h3>
            <p>🌳 Trees Saved: {ecoImpact.treesSaved}</p>
            <p>🌍 CO₂ Reduced (kg): {ecoImpact.co2Reduced}</p>
            <p>💧 Water Saved (liters): {ecoImpact.waterSaved}</p>
          </div>
        )}

        <div className="wastelog__tips">
          <h4>Eco Tips:</h4>
          <ul>
            <li>Consider reducing your single-use plastics!</li>
            <li>Composting can reduce your food waste impact significantly.</li>
          </ul>
        </div>
      </div>

      <div className="wastelog__history-section">
        <h3>Impact History</h3>
        {history.length === 0 ? (
          <p>No recorded impacts yet.</p>
        ) : (
          <div className="wastelog__history-grid">
            {history.map((item, index) => (
              <div className="wastelog__history-card" key={index}>
                <p><strong>Impact recorded at:</strong> {new Date(item.timestamp.seconds * 1000).toLocaleString()}</p>
                <p>🌳 <strong>Trees Saved:</strong> {item.treesSaved}</p>
                <p>🌍 <strong>CO₂ Reduced (kg):</strong> {item.co2Reduced}</p>
                <p>💧 <strong>Water Saved (liters):</strong> {item.waterSaved}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="wastelog__error">{error}</p>}
    </div>
  );
};

export default EcoImpactTracker;
