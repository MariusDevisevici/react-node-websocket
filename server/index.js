const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const authRouter = require("./routes/authRouter");
const http = require("http");
const mediaRouter = require("./routes/mediaRouter");
const userRouter = require("./routes/userRouter");
const chatRouter = require("./routes/chatRouter");
const adminRouter = require("./routes/adminRouter");
const cookie = require("cookie-parser");
const { Server, Socket } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
///M iddlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(cookie());
app.use(express.json());
app.use(express.static("./uploads"));

////Routes
app.use("/", authRouter);
app.use("/", mediaRouter);
app.use("/", userRouter);
app.use("/", chatRouter);
app.use("/", adminRouter);
///Server with socket

server.listen(8000, () => {
  console.log("Server running...");
});

io.on("connection", (socket) => {
  socket.on("send_message", (data) => {
    io.sockets.emit("receive_message", data);
  });
});

// /SERVER
// app.listen(8000, () => {
//   console.log("Server running...");
// });

///Socket server
// socketio(
//   app.listen(8000, () => {
//     console.log("Socket running...");
//   })
// );
