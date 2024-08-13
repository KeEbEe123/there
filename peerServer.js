const { PeerServer } = require("peer");
const port = process.env.PEER_PORT || 443;

const options = {
  port: port,
  proxied: true,
  path: "/myapp",
};

try {
  const peerServer = PeerServer(options);
  console.log(`peer server started on ${port}`)

  peerServer.on("connection", (client) => {
    console.log("PeerJS client connected:", client.id);
  });

  peerServer.on("disconnect", (client) => {
    console.log("PeerJS client disconnected:", client.id);
  });
} catch (error) {
  console.error("Error starting PeerJS server:", error);
}
