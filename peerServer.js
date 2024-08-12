const { PeerServer } = require("peer");

const peerServer = PeerServer({
  port: process.env.PEER_PORT || 3001,
  path: "/myapp",
  proxied: true,
});

peerServer.on("connection", (client) => {
  console.log("PeerJS client connected:", client.id);
});

peerServer.on("disconnect", (client) => {
  console.log("PeerJS client disconnectedd:", client.id);
});
