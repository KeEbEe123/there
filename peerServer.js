const { PeerServer } = require("peer");


const options = {
  port: process.env.PORT || 3001,
  proxied: true,
  path: "/myapp",
};

try {
  const peerServer = PeerServer(options);

  peerServer.on("connection", (client) => {
    console.log("PeerJS client connected:", client.id);
  });

  peerServer.on("disconnect", (client) => {
    console.log("PeerJS client disconnected:", client.id);
  });
} catch (error) {
  console.error("Error starting PeerJS server:", error);
}
