import React, { useState, useCallback, useEffect, useRef } from "react";

const Video = ({
  stream,
  userId,
  initialPosition,
  initialSize,
  onPositionChange,
  onSizeChange,
  isScreen,
  screenShareStream,
  localUserId
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const videoRef = useRef(null);
  const screenShareRef = useRef(null);

  useEffect(() => {
    setPosition(initialPosition);
    setSize(initialSize);
  }, [initialPosition, initialSize]);

  const startDrag = useCallback(
    (e) => {
      setDragging(true);
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position]
  );

  const onDrag = useCallback(
    (e) => {
      if (dragging) {
        const newPosition = {
          x: e.clientX - offset.x,
          y: e.clientY - offset.y,
        };
        setPosition(newPosition);
        onPositionChange(userId, newPosition);
      }
    },
    [dragging, offset, userId, onPositionChange]
  );

  const stopDrag = useCallback(() => {
    setDragging(false);
  }, []);

  const startResize = (e) => {
    e.stopPropagation();
    setResizing(true);
    setOffset({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const onResize = useCallback(
    (e) => {
      if (resizing) {
        const temp = size.width + (e.clientX - offset.x);
        if (temp < 300 && temp > 100 && !isScreen) {
          const newSize = {
            width: size.width + (e.clientX - offset.x),
            height: size.height + (e.clientY - offset.y),
          };
          setSize(newSize);
          onSizeChange(userId, newSize); // Emit size change
          setOffset({ x: e.clientX, y: e.clientY });
        } else {
          const newSize = {
            width: size.width + (e.clientX - offset.x),
            height: size.height + (e.clientY - offset.y),
          };
          setSize(newSize);
          onSizeChange(userId, newSize); // Emit size change
          setOffset({ x: e.clientX, y: e.clientY });
        }
      }
    },
    [resizing, offset, size, userId, onSizeChange]
  );

  const stopResize = useCallback(() => {
    setResizing(false);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onDrag);
      window.addEventListener("mouseup", stopDrag);
      return () => {
        window.removeEventListener("mousemove", onDrag);
        window.removeEventListener("mouseup", stopDrag);
      };
    }
  }, [dragging, onDrag, stopDrag]);

  useEffect(() => {
    if (resizing) {
      window.addEventListener("mousemove", onResize);
      window.addEventListener("mouseup", stopResize);
      return () => {
        window.removeEventListener("mousemove", onResize);
        window.removeEventListener("mouseup", stopResize);
      };
    }
  }, [resizing, onResize, stopResize]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = userId === localUserId;
      videoRef.current.play();
    }
  }, [stream, userId, localUserId]);

  useEffect(() => {
    if (screenShareRef.current && screenShareStream) {
      screenShareRef.current.srcObject = screenShareStream;
      screenShareRef.current.play();
    }
  }, [screenShareStream]);

  return (
    <div
      onMouseDown={startDrag}
      className="absolute cursor-move border-[#ddd] bg-transparent"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: !isScreen ? `${size.width}px` : `${size.width}px`,
        height: !isScreen ? `${size.width}px` : `${size.width * (9 / 16)}px`,
      }}
    >
      <video
        ref={videoRef}
        className={
          !isScreen
            ? `w-full h-full object-cover rounded-full`
            : `w-full h-full object-contain -z-12`
        }
      />

      <div
        onMouseDown={startResize}
        className="absolute bottom-0 right-0 cursor-se-resize w-5 h-5 flex justify-items-end"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="white"
          className="bi bi-arrows-angle-expand rotate-90"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707m4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707"
          />
        </svg>
      </div>
    </div>
  );
};

export default Video;
