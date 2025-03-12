import React from "react";
import "./WasteGuide.css";

const WasteGuide = () => {
  return (
    <div className="waste-guide-container">
      <div className="waste-guide-content">
        <h2>Waste Sorting Guide</h2>
        <p>Learn how to properly dispose of waste in your area.</p>

        <div className="waste-category biodegradable">
          <h3>Biodegradable</h3>
          <p>Examples: Food scraps, paper, leaves.</p>
        </div>

        <div className="waste-category non-biodegradable">
          <h3>Non-Biodegradable</h3>
          <p>Examples: Plastic bags, glass bottles, aluminum cans.</p>
        </div>

        <div className="waste-category recyclable">
          <h3>Recyclable</h3>
          <p>Examples: Paper, metal, certain plastics.</p>
        </div>
      </div>
    </div>
  );
};

export default WasteGuide;
