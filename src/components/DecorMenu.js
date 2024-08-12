import React, { useState } from "react";

const DecorMenu = ({ onAddDecor }) => {
  const decorOptions = [
    { id: "1", url: "path/to/decor1.gif", name: "Decor 1" },
    { id: "2", url: "path/to/decor2.png", name: "Decor 2" },
    // Add more decor items here
  ];

  return (
    <div className="decor-menu">
      {decorOptions.map((decor) => (
        <div
          key={decor.id}
          className="decor-item"
          onClick={() => onAddDecor(decor)}
        >
          <img src={decor.url} alt={decor.name} className="decor-image" />
          <p>{decor.name}</p>
        </div>
      ))}
    </div>
  );
};

export default DecorMenu;
