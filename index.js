const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const expressServer = http.createServer(app);

// configure socket.io
const io = new Server(expressServer);
let mappedRooms = [];
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("joinRoom", (data) => {
    socket.join(data.roomid);

    const existingRoom = mappedRooms.find(
      (room) => room.roomid === data.roomid
    );
    if (existingRoom) {
      let roomSize = io.sockets.adapter.rooms.get(data.roomid).size;
      existingRoom.users.forEach((user) => {
        io.to(user.socketId).emit("joined_message", {
          message: data.username + " joined",
          roomSize,
        });
      });
      existingRoom.users.push({ username: data.username, socketId: socket.id });
      // io.to(data.roomid).emit("joined_message", data.username + " joined");
    } else {
      mappedRooms.push({
        roomid: data.roomid,
        users: [{ username: data.username, socketId: socket.id }],
      });
    }
  });
  socket.on("chatMessage", (data) => {
    const room = mappedRooms.find((room) => room.roomid === data.roomid);
    if (room) {
      io.sockets.in(room.roomid).emit("send_message", {
        username: data.username,
        message: data.message,
      });
    }
  });
  socket.on("disconnect", () => {
    let room = mappedRooms.find((room) => {
      return room.users.find((user) => user.socketId === socket.id);
    });
    let user = room?.users.find((user) => user.socketId === socket.id);

    mappedRooms.forEach((room) => {
      room.users = room.users.filter((user) => user.socketId !== socket.id);
    });

    io.sockets
      .in(room?.roomid)
      .emit("leave_room", user?.username + " left the room");
    console.log("user disconnected");
  });
});

// client
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

expressServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
