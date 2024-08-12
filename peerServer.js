const { PeerServer } = require("peer");
const express = require("express");
const http = require("http");

// Create an Express app
const app = express();
const server = http.createServer(app);

// Set up PeerJS server
const peerServer = PeerServer({
  port: process.env.PEER_PORT || process.env.PORT || 443, // Use the port provided by Render or a fallback port
  proxied: true,
  // Optionally, you can include SSL certificates here if needed
});

peerServer.on("connection", (client) => {
  console.log("PeerJS client connected:", client.id);
});

peerServer.on("disconnect", (client) => {
  console.log("PeerJS client disconnected:", client.id);
});

// Start the server
const PORT = process.env.PORT || 443;
server.listen(PORT, () => {
  console.log(`PeerJS server is running on port ${PORT}`);
});
