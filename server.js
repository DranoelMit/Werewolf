var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var WerewolfGame = require("./serverside/WerewolfGame.js");

var users = [];
var isUserReady = [];
var connections =[];

var dayResList =[];
var nightResList =[];

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
     function startGame(){
          console.log("STARTING GAME...");
          var game = new WerewolfGame(users);
          io.sockets.emit("start", game.players);

          serverDay();

     }
     function serverDay(){

          io.sockets.emit("day");

          socket.on("day res", function(dayRes){
               dayResList.push(dayRes);
               for(i=0; i<dayResList.length; i++)
                    console.log(dayResList[i]);
               if(dayResList.length == users.length){
               game.day(dayResList); //changes game.players based on Vote
               dayResList=[];
               io.sockets.emit("day summary", game.players); //client needs to figure out who died based on change in .alive booleans (in response to day summary request)

               if(game.isGameOver) gameOver();
               else serverNight();
               }
          });
     }
     function serverNight(){

          io.sockets.emit("night");

          socket.on("night res", function(nightRes){
               nightResList.push(nightRes);

               if(nightResList.length == game.numWolfs){
               game.night(nightResList); //changes game.players based on Vote
               nightResList =[];
               io.sockets.emit("night summary", game.players); //client needs to figure out who died based on change in .alive booleans (in response to day summary request)

               if(game.isGameOver) gameOver();
               else serverDay();
               }
          });
     }
     function gameOver(){
          let resultMessage = game.results();
          io.sockets.emit("game over", resultMessage);
     }


});
