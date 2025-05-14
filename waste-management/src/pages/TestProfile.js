import React, { useState } from "react";

const TestProfile = () => {
  const [editMode, setEditMode] = useState(false);

  return (
    <div style={{ padding: 40 }}>
      <h2>Test Profile</h2>
      <div>Edit mode: {editMode ? "ON" : "OFF"}</div>
      <button onClick={() => setEditMode(true)} style={{ marginRight: 10 }}>Edit Profile</button>
      <button onClick={() => setEditMode(false)}>Cancel</button>
    </div>
  );
};

export default TestProfile; 