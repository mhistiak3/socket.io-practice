const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const expressServer = http.createServer(app);

// configure socket.io
const io = new Server(expressServer)
io.on('connection',(socket)=>{
    console.log('a user connected:',socket.id)
    setTimeout(()=>{
       socket.send('Welcome To Socket.io > Server to Client ') 
    },1000)
    socket.on('disconnect',()=>{
        console.log("a user disconnected:", socket.id);
    })
})

// client
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

expressServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
