import React from "react";
import "./WasteGuide.css";

const WasteGuide = () => {
  return (
    <div className="waste-guide-container">
      <div className="waste-guide-content">
        <h2>Waste Sorting Guide</h2>
        <p>Learn how to properly dispose of waste in your area.</p>
        <video
          src="/Guide.mp4"
          controls
          width="100%"
          className="waste-guide-video"
        >
          Your browser does not support the video tag.
        </video>
        <div className="waste-category biodegradable">
          <h3>Biodegradable</h3>
          <p>Examples: Food scraps, paper, leaves.</p>
          <div className="waste-guide-images">
            <img src="/Food Scrap.jpg" alt="Biodegradable waste example 1" />

            <img src="/paper.jpg" alt="Biodegradable waste example 3" />
          </div>
        </div>
        <div className="waste-category non-biodegradable">
          <h3>Non-Biodegradable</h3>
          <p>Examples: Plastic bags, glass bottles, aluminum cans.</p>
          <div className="waste-guide-images">
            <img src="/Plastic Bags.jpg" alt="Biodegradable waste example 2" />
            <img src="/Glass Bottles.jpg" alt="Biodegradable waste example 2" />
            <img src="/Cans.jpg" alt="Biodegradable waste example 2" />
          </div>
        </div>
        <div className="waste-category recyclable">
          <h3>Recyclable</h3>
          <p>Examples: Paper, metal, certain plastics.</p>
          <div className="waste-guide-images-recycle">
            <img src="/Recycable.jpg" alt="Biodegradable waste example 2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteGuide;