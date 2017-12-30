var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

var users = [];
var connections =[];

server.listen(process.env.PORT || 8080);

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
     res.sendFile(__dirname + "/public/main.html");
});


io.sockets.on("connection", function(socket){
     connections.push(socket);
     console.log("Connected: " + connections.length + " sockets connected");

          //disconnect
     socket.on("disconnect", function(data)
     {
          connections.splice(connections.indexOf(socket), 1);
          console.log("Discconected: " +connections.length + " sockets connected");
     });

     socket.on("send message", function(data){
          io.sockets.emit("new message", {msg:data});
     });

});
