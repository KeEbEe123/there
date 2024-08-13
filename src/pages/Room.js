import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import Peer from "peerjs";
import Video from "../components/Video";
import Navbar from "../components/Navbar";
import Chat from "../components/Chat";

import { useMedia } from "../components/MediaContext";

const Room = () => {
  const { room } = useParams(); // Get the room ID from the URL parameters
  const [users, setUsers] = useState([]); // State to manage connected users and their streams
  const socket = useRef(); // UseRef to store the socket instance
  const myPeer = useRef(); // UseRef to store the PeerJS instance
  const myVideoStream = useRef(); // UseRef to store the local video stream
  const { webcamOn, audioOn } = useMedia();
  const screenStreamRef = useRef();
  const screenPeer = useRef();
  const [stream, setStream] = useState(null);
  const [positions, setPositions] = useState({});
  const [sizes, setSizes] = useState({}); // State to manage video sizes
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [screenStream, setScreenStream] = useState(null); // Track if screen sharing is active
  const [chatOpen, setChatOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [enteredUsername, setEnteredUsername] = useState(false);
  const [messages, setMessages] = useState([]);
  const [background, setBackground] = useState("/backgrounds/night-room.jpg");

  useEffect(() => {
    console.log(enteredUsername);
    if (enteredUsername) {
      socket.current = io("https://there-1.onrender.com/");
      myPeer.current = new Peer(`peer_${Math.random().toString(36).substring(7)}`, {
  host: '0.peerjs.com',
  secure: true,
  port: 443,
  path: '/'
});

      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          setStream(stream);
          myVideoStream.current = stream;
          addVideoStream(myPeer.current.id, stream); // Use PeerJS ID for the local user

          myPeer.current.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (userVideoStream) => {
              addVideoStream(call.peer, userVideoStream);
            });
          });

          socket.current.emit("join-room", room, myPeer.current.id);

          socket.current.on("user-connected", (userId) => {
            connectToNewUser(userId, stream);
          });

          socket.current.on("user-disconnected", (userId) => {
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user.id !== userId)
            );
          });

          // Listen for initial positions and sizes
          socket.current.on("initialPositions", (positions) => {
            setPositions(positions);
          });

          socket.current.on("initialSizes", (sizes) => {
            setSizes(sizes);
          });

          socket.current.on("positionChanged", ({ userId, position }) => {
            setPositions((prevPositions) => ({
              ...prevPositions,
              [userId]: position,
            }));
          });

          socket.current.on("sizeChanged", ({ userId, size }) => {
            setSizes((prevSizes) => ({
              ...prevSizes,
              [userId]: size,
            }));
          });
          // Listen for position and size changes
          socket.current.on("receive-message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
          });

          socket.current.on("background-changed", (imageUrl) => {
            setBackground(imageUrl);
          });
          // Handle screen sharing
          socket.current.on("user-screen-share-started", ({ userId }) => {
            // Create a new PeerJS call to receive the screen stream
            const call = myPeer.current.call(userId, stream);
            call.on("stream", (screenStream) => {
              addVideoStream(userId, screenStream, true);
            });
          });

          socket.current.on("user-screen-share-stopped", ({ userId }) => {
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user.id !== userId)
            );
            console.log("waste-2");
          });
        });

      return () => {
        socket.current.disconnect();
        myPeer.current.destroy();
        socket.off("background-changed");
      };
    }
  }, [room, enteredUsername]);

  useEffect(() => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = webcamOn;
    }
  }, [webcamOn, stream]);

  useEffect(() => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = audioOn;
    }
  }, [audioOn, stream]);

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      setEnteredUsername(true);
    }
  };

  const sendMessage = (newMessage) => {
    if (newMessage.trim() !== "") {
      const messageData = { room, content: newMessage, sender: username };
      socket.current.emit("send-message", messageData);
      // setMessages((prevMessages) => [...prevMessages, messageData]);
    }
  };

  const handleBackgroundChange = (imageUrl) => {
    // Emit the background change event to the server
    console.log(imageUrl);
    socket.current.emit("change-background", imageUrl);
  };

  const addVideoStream = (id, stream, isScreen = false) => {
    setUsers((prevUsers) => {
      if (prevUsers.some((user) => user.id === id)) {
        return prevUsers; // Prevent adding the same user stream again
      }
      return [...prevUsers, { id, stream, isScreen }];
    });
  };

  const connectToNewUser = (userId, stream) => {
    const call = myPeer.current.call(userId, stream);

    call.on("stream", (userVideoStream) => {
      addVideoStream(userId, userVideoStream);
      addVideoStream(userId, userVideoStream);
    });
  };

  const handlePositionChange = (userId, position) => {
    console.log(userId, position);
    socket.current.emit("updatePosition", { userId, position });
  };

  const handleSizeChange = (userId, size) => {
    console.log(userId, size);
    socket.current.emit("updateSize", { userId, size });
  };

  const startScreenShare = () => {
    if (screenShareActive) return;

    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: true })
      .then((screenStream) => {
        screenPeer.current = new Peer(undefined, { host: '0.peerjs.com',
  secure: true,
  port: 443,
  path: '/'});
        screenStreamRef.current = screenStream;

        screenPeer.current.on("open", (id) => {
          setScreenShareActive(true);
          addVideoStream(id, screenStream, true);

          socket.current.emit("screen-share-started", { userId: id });

          screenStream.getVideoTracks()[0].onended = () => {
            setScreenShareActive(false);
            socket.current.emit("screen-share-stopped", { userId: id });
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            screenPeer.current.destroy();
          };
        });

        screenPeer.current.on("call", (call) => {
          call.answer(screenStream);
        });
      })
      .catch((err) => console.error("Error sharing the screen:", err));
  };

  const closeChat = () => {
    setChatOpen(false);
  };
  console.log(screenStream);
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap"
        rel="stylesheet"
      />
      <div
        className="bg-cover min-h-screen"
        style={{ backgroundImage: `url(${background})` }}
      >
        {!enteredUsername ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <h2 className=" font-pixelify text-7xl text-white">
              Enter your name to join the room
            </h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 mb-4 mt-4 rounded-lg bg-slate-400/50 text-white font-pixelify"
              placeholder="Your Name"
            />
            <button
              onClick={handleUsernameSubmit}
              className="p-2 bg-red-500 text-white rounded font-pixelify"
            >
              Join Room
            </button>
          </div>
        ) : (
          <>
            <Navbar
              startScreenShare={startScreenShare}
              screenShareActive={screenShareActive}
              onBackgroundChange={handleBackgroundChange}
            />
            <h1 className="font-bold">Room ID: {room}</h1>
            <div className="grid grid-row-4 grid-flow-col gap-4">
              {users.map((user) => (
                <Video
                  key={user.id}
                  stream={user.stream}
                  userId={user.id}
                  roomId={room}
                  initialPosition={positions[user.id] || { x: 0, y: 0 }} // Pass initial position
                  initialSize={
                    sizes[user.id] || !user.isScreen
                      ? { width: 200, height: 200 }
                      : { width: 640, height: 360 }
                  } // Pass initial size
                  onPositionChange={handlePositionChange} // Handle position change
                  onSizeChange={handleSizeChange} // Handle size change
                  isScreen={user.isScreen} // Pass screen sharing flag
                  screenShareStream={screenStream}
                />
              ))}
            </div>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="fixed bottom-5 right-5 p-3 bg-slate-300/50 text-white rounded-full shadow-lg"
            >
              💬
            </button>
            {chatOpen && (
              <Chat
                socket={socket}
                room={room}
                onClose={closeChat}
                username={username}
                messages={messages}
                sendMessage={sendMessage}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Room;
