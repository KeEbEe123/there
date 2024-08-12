const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { v4: uuidV4 } = require("uuid");
const path = require("path");
const io = require("socket.io")(server);

const buildPath = path.join(__dirname, "build");

app.use(express.static(buildPath));
console.log(buildPath);
app.get("/", (req, res) => {
  res.sendFile(buildPath + "/index.html");
});

app.get("/getRoom", (req, res) => {
  const newRoomId = uuidV4();
  console.log("Generated Room ID:", newRoomId);
  res.redirect(`/${newRoomId}`);
});

app.get("/:room", (req, res) => {
  console.log("Serving room:", req.params.room);
  res.sendFile(path.join(buildPath, "index.html"));
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

let positions = {};
let sizes = {};

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    // Send initial positions and sizes
    socket.emit("initialPositions", positions[roomId] || {});
    socket.emit("initialSizes", sizes[roomId] || {});

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
      if (positions[roomId]) {
        delete positions[roomId][userId];
      }
      if (sizes[roomId]) {
        delete sizes[roomId][userId];
      }
    });

    socket.on("updatePosition", ({ userId, position }) => {
      if (!positions[roomId]) {
        positions[roomId] = {};
      }
      positions[roomId][userId] = position;
      socket.to(roomId).emit("positionChanged", { userId, position });
    });

    socket.on("updateSize", ({ userId, size }) => {
      if (!sizes[roomId]) {
        sizes[roomId] = {};
      }
      sizes[roomId][userId] = size;
      socket.to(roomId).emit("sizeChanged", { userId, size });
    });
    socket.on("send-message", (message) => {
      io.to(roomId).emit("receive-message", message); // Broadcast message to the room
    });
    socket.on("change-background", (imageUrl) => {
      io.to(roomId).emit("background-changed", imageUrl);
    });

    // Handle screen share start
    socket.on("screen-share-started", ({ userId, stream }) => {
      if (roomId) {
        socket.to(roomId).emit("user-screen-share-started", { userId });
        console.log(stream);
      }
    });

    // Handle screen share stop
    socket.on("screen-share-stopped", ({ userId }) => {
      if (roomId) {
        socket.to(roomId).emit("user-screen-share-stopped", { userId });
      }
    });
  });
});
