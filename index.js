const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const expressServer = http.createServer(app);

// configure socket.io
const io = new Server(expressServer);
io.on("connection", (socket) => {
  //   setInterval(() => {
    //   let date = new Date();
    //   let time = date.toLocaleTimeString();
  //     socket.send(time);
  //   });
    setInterval(() => {
      let date = new Date();
      let time = date.toLocaleTimeString();
        socket.emit("welcome", time);
    },100);


  socket.on("disconnect", () => {
    console.log("a user disconnected:", socket.id);
  });
});

// client
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

expressServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
