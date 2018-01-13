var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var WerewolfGame = require("./serverside/WerewolfGame.js");

var users = []; //array of usernames in the lobby
var isUserReady = []; //boolean array synched with users to determine if everyone in the lobby is ready
var connections =[]; //list of sockets, users AND people on login page, essentially anyone on the page
var game; //werewolf game object, not initialized until all users are ready (determines roles when initialized)

//lists of responses from votes during rounds
     var dayResList =[];
     var nightResList =[];

const MAXPLAYERS = 12;
const MINPLAYERS = 4;
const callbackStatus = {
                              good: 0,
                              nameTaken: 1,
                              lobbyFull : 2
                       };
const TIME_DELAY = 5000; //used in timeout calls in between Day & Night Transitions
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


socket.on("day res", function(dayRes){
     dayResList.push(dayRes);

     if(dayResList.length == users.length){

          let decision = game.day(dayResList);
          console.log("DAY VOTE ENDED: "+ decision); //changes game.players based on Vote
          dayResList=[];

          if(decision==="ERR_TIE"){
               serverDay(true);
          }
          // this isnt working at all //else if(game.isGameOver()){
          //     gameOver();
          //}
          else{
                io.sockets.emit("day summary", decision); //client needs to figure out who died based on change in .alive booleans (in response to day summary request)
                setTimeout(function(){
                     serverNight();
                }, TIME_DELAY);
           }
     }
});

socket.on("send wolfMessage", function(data){
		  io.sockets.emit("new wolfMessage", {msg:data, user: socket.username});
	      });

socket.on("night res", function(nightRes){
     nightResList.push(nightRes);

     if(nightResList.length == game.numWolfs){
    let decision =  game.night(nightResList); //changes game.players based on Vote
    console.log("NIGHT VOTE OVER, WEREWOLVES TO KILL: "+ decision);
    nightResList =[];
     if(decision==="ERR_TIE"){
	 io.sockets.emit("nightVote tie"); //just reset the poll for werewolfs, can't overhaul everything like when everyone is on the same page during the day
     }
     //else if(game.isGameOver) gameOver();
     else{
	 io.sockets.emit("night summary", game.players);
	 setTimeout(function(){
		 serverDay(false);
	     }, TIME_DELAY);
     }
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
           game = new WerewolfGame(users);
          io.sockets.emit("start", game.players);

          serverDay(false);

     }
     function serverDay(wasTie){

	 io.sockets.emit("day", wasTie);

     }
     function serverNight(){

          io.sockets.emit("night");

     }
     function gameOver(){
          let resultMessage = game.results();
          io.sockets.emit("game over", resultMessage);
     }


});
