import React, { useState } from "react";
import { useMedia } from "./MediaContext";

const micOn = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    fill="currentColor"
    class="bi bi-mic"
    viewBox="0 0 16 16"
  >
    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
    <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3" />
  </svg>
);

const videoOn = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    fill="currentColor"
    class="bi bi-camera-video"
    viewBox="0 0 16 16"
  >
    <path
      fill-rule="evenodd"
      d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"
    />
  </svg>
);

const videoOff = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    fill="currentColor"
    class="bi bi-camera-video-off"
    viewBox="0 0 16 16"
  >
    <path
      fill-rule="evenodd"
      d="M10.961 12.365a2 2 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l.714 1H9.5a1 1 0 0 1 1 1v6a1 1 0 0 1-.144.518zM1.428 4.18A1 1 0 0 0 1 5v6a1 1 0 0 0 1 1h5.014l.714 1H2a2 2 0 0 1-2-2V5c0-.675.334-1.272.847-1.634zM15 11.73l-3.5-1.555v-4.35L15 4.269zm-4.407 3.56-10-14 .814-.58 10 14z"
    />
  </svg>
);

const backgrounds = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    fill="currentColor"
    class="bi bi-images"
    viewBox="0 0 16 16"
  >
    <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
    <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z" />
  </svg>
);

const micOff = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    fill="currentColor"
    class="bi bi-mic-mute"
    viewBox="0 0 16 16"
  >
    <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4 4 0 0 0 12 8V7a.5.5 0 0 1 1 0zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a5 5 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4m3-9v4.879l-1-1V3a2 2 0 0 0-3.997-.118l-.845-.845A3.001 3.001 0 0 1 11 3" />
    <path d="m9.486 10.607-.748-.748A2 2 0 0 1 6 8v-.878l-1-1V8a3 3 0 0 0 4.486 2.607m-7.84-9.253 12 12 .708-.708-12-12z" />
  </svg>
);

const share = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    fill="currentColor"
    class="bi bi-upload"
    viewBox="0 0 16 16"
  >
    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
  </svg>
);

function Navbar({ startScreenShare, onBackgroundChange }) {
  let video = videoOn;
  let mic = micOn;
  const { webcamOn, toggleWebcam, audioOn, toggleAudio } = useMedia();
  const [currentSlide, setCurrentSlide] = useState(0);
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
        className="absolute bottom-16 left-[50%] transform -translate-x-[10%] bg-white p-4 rounded-lg shadow-lg flex items-center w-[50%]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button onClick={handlePrev} className="p-1">
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

  return (
    <nav className="bg-slate-300/50 h-16 w-[30%] rounded-3xl absolute bottom-5  left-[35%] flex align-bottom justify-items-center justify-center items-center space-x-9">
      <div>
        <button onClick={startScreenShare}>{share}</button>
      </div>
      <div className="flex justify-items-center justify-center items-center space-x-9">
        <button
          onClick={toggleWebcam}
          className={`h-[50px] w-[50px] rounded-full flex items-center justify-center transition-colors ease-in-out ${
            webcamOn ? "bg-transparent" : "bg-red-500"
          }`}
        >
          {webcamOn ? videoOn : videoOff}
        </button>
        <button
          onClick={toggleAudio}
          className={`h-[50px] w-[50px] rounded-full flex items-center justify-center transition-colors ease-in-out ${
            audioOn ? "bg-transparent" : "bg-red-500"
          }`}
        >
          {audioOn ? micOn : micOff}
        </button>
      </div>

      <button onMouseEnter={() => setIsHovered(true)}>{backgrounds}</button>
      {isHovered && <Carousel onBackgroundChange={onBackgroundChange} />}
    </nav>
  );
}

export default Navbar;
