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
          users.splice(users.indexOf(socket.username), 1);
          updateUsernames();
          connections.splice(connections.indexOf(socket), 1);
          console.log("Discconected: " +connections.length + " sockets connected");
     });
//send message
     socket.on("send message", function(data){
          io.sockets.emit("new message", {msg:data, user: socket.username});
     });
//new user
     socket.on("new user", function(data, callback){
          callback(true);
          socket.username = data;
          users.push(socket.username);
          updateUsernames();
     });

     function updateUsernames(){
          io.sockets.emit("get users", users);
     }

});
