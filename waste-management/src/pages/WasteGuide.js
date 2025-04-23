import React, { useState } from "react";
import "./WasteGuide.css";

const categoryData = [
  {
    key: "biodegradable",
    title: "Biodegradable",
    description: "Examples: Food scraps, paper, leaves.",
    images: ["/Food Scrap.jpg", "/paper.jpg"],
    cssClass: "biodegradable",
  },
  {
    key: "non-biodegradable",
    title: "Non-Biodegradable",
    description: "Examples: Plastic bags, glass bottles, aluminum cans.",
    images: ["/Plastic Bags.jpg", "/Glass Bottles.jpg", "/Cans.jpg"],
    cssClass: "non-biodegradable",
  },
  {
    key: "recyclable",
    title: "Recyclable",
    description: "Examples: Paper, metal, certain plastics.",
    images: ["/Recycable.jpg"],
    cssClass: "recyclable",
  },
];

const WasteGuide = () => {
  const [activeSection, setActiveSection] = useState("video");
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const handleNextCategory = () => {
    setActiveCategoryIndex((prevIndex) => (prevIndex + 1) % categoryData.length);
  };

  const handlePrevCategory = () => {
    setActiveCategoryIndex(
      (prevIndex) => (prevIndex - 1 + categoryData.length) % categoryData.length
    );
  };

  const activeCategory = categoryData[activeCategoryIndex];

  return (
    <div className="waste-guide-container">
      <div className="waste-guide-content">
        <h2>Waste Sorting Guide</h2>
        <p>Learn how to properly dispose of waste in your area.</p>

        <div className="nav-buttons-wrapper">
          <button onClick={() => setActiveSection("video")} className="nav-button left">
            &lt;
          </button>
          <button onClick={() => setActiveSection("guide")} className="nav-button right">
            &gt;
          </button>
        </div>

        {activeSection === "video" && (
          <div className="waste-guide-section video-section">
            <video
              src="/Guide.mp4"
              controls
              width="100%"
              className="waste-guide-video"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {activeSection === "guide" && (
          <div className="waste-guide-section all-waste-guide">
            <div className="category-nav-container category-nav-container-left">
              <button onClick={handlePrevCategory} className="category-nav-button">
                &lt;
              </button>
            </div>
            <div className="waste-guide-category-content">
              <div className={`waste-guide-category ${activeCategory.cssClass}`}>
                <h3>{activeCategory.title}</h3>
                <p>{activeCategory.description}</p>
                <div className="waste-guide-images">
                  {activeCategory.images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${activeCategory.title} example ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="category-nav-container category-nav-container-right">
              <button onClick={handleNextCategory} className="category-nav-button">
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WasteGuide;