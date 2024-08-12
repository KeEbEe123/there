import React, { useState } from "react";
import { useMedia } from "./MediaContext";
const images = [
  "/backgrounds/night-room.jpg",
  "/backgrounds/morning-room.jpg",
  "/backgrounds/city-room.jpg",
]; // Add more image paths as needed

const [isHovered, setIsHovered] = useState(false);
const Carousel = ({ onBackgroundChange }) => {
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    onBackgroundChange(images[currentSlide]);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    onBackgroundChange(images[currentSlide]);
  };

  return (
    <div
      className="absolute bottom-16 left-[50%] transform -translate-x-[50%] bg-white p-4 rounded-lg shadow-lg flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button onClick={handlePrev} className="p-2">
        &lt;
      </button>
      <img
        src={images[currentSlide]}
        alt={`Background ${currentSlide + 1}`}
        className="w-40 h-40 object-cover"
      />
      <button onClick={handleNext} className="p-2">
        &gt;
      </button>
    </div>
  );
};

export default Carousel;
