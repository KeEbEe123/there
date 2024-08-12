import React, { createContext, useContext, useState } from "react";

const MediaContext = createContext();

export const useMedia = () => {
  return useContext(MediaContext);
};

export const MediaProvider = ({ children }) => {
  const [webcamOn, setWebcamOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);

  const toggleWebcam = () => {
    setWebcamOn((prevState) => !prevState);
  };

  const toggleAudio = () => {
    setAudioOn((prevState) => !prevState);
  };

  return (
    <MediaContext.Provider
      value={{ webcamOn, toggleWebcam, audioOn, toggleAudio }}
    >
      {children}
    </MediaContext.Provider>
  );
};
