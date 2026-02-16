const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const pollRoutes = require("./routes/pollRoutes");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Create socket server
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// Make io available inside controllers
app.set("io", io);

app.use(cors());
app.use(express.json());

app.use("/api/polls", pollRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

// Socket connection logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Socket joined room: ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
