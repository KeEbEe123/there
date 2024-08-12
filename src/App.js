import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Room from "./pages/Room";
import Home from "./pages/Home";
import "bootstrap-icons/font/bootstrap-icons.css";
import { MediaProvider } from "./components/MediaContext";

function App() {
  const [background, setBackground] = useState("./backgrounds/night-room.jpg");
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap"
        rel="stylesheet"
      />
      <MediaProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:room" element={<Room />} />
          </Routes>
        </Router>
      </MediaProvider>
    </>
  );
}

export default App;
