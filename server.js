var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var werewolf = require("./serverside/werewolf.js");

var users = [];
var isUserReady = [];
var connections =[];
const MAXPLAYERS = 12;
const MINPLAYERS = 4;
const callbackStatus = {
                              good: 0,
                              nameTaken: 1,
                              lobbyFull : 2
                       };

server.listen(process.env.PORT || 8080);

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
     res.sendFile(__dirname + "/public/index.html");
});


io.sockets.on("connection", function(socket){
     connections.push(socket);
     console.log("Connected: " + connections.length + " sockets connected");

          //disconnect
     socket.on("disconnect", function(data)
     {
          let nameIndex = users.indexOf(socket.username);
          if(nameIndex > -1){
               users.splice(nameIndex, 1);
               isUserReady.splice(nameIndex, 1);
               updateUsernames();
          }
          connections.splice(connections.indexOf(socket), 1);
          console.log("Discconected: " +connections.length + " sockets connected");
     });
//send message
     socket.on("send message", function(data){
          io.sockets.emit("new message", {msg:data, user: socket.username});
     });
//new user
     socket.on("new user", function(data, callback){
          if(users.indexOf(data) != -1){
               callback(callbackStatus.nameTaken); //callback status, username taken
          }
          else if(!(users.length < MAXPLAYERS)){
               callback(callbackStatus.lobbyFull);
          }
          else{
               callback(callbackStatus.good); //
               socket.username = data;
               users.push(socket.username);
               isUserReady.push(false);
               updateUsernames();
          }
     });
//Change user ready status
socket.on("ready user", function(ready)
{

     isUserReady[users.indexOf(socket.username)] = ready;
     updateUsernames();
     //GAME SHOULD START HERE
     if(allUsersReady() && users.length >= MINPLAYERS)
     {
          startGame();
     }
});
//Update user list
     function updateUsernames(){
          let nameReadyList = [];
          for(let i=0; i<users.length; i++){
               nameReadyList.push({name: users[i], ready:isUserReady[i]});
          }
          io.sockets.emit("get users", nameReadyList);
     }
     //check if every user is ready
     function allUsersReady()
     {
          for(i=0; i<users.length; i++)
               if(!isUserReady[i]){
                    return false;
               }
          return true;
     }
     function startGame()
     {
          console.log("STARTING GAME...");
          var game = new werewolf.WerewolfGameConstruct(this, io, users, connections);
          io.sockets.emit("start", game.players);

     }

});
