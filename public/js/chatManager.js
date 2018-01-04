
     var socket = io.connect();
     var $body = $("body");
     var $introView = $("#introView");
     var $chatArea = $("#chatArea");
     var $messageForm = $("#messageForm");
     var $message = $("#message");
     var $chat = $("#chat");
     var $usernameForm = $("#usernameForm");
     var $users = $("#users");
     var $userInput = $("#userInput");
     var $nightButton = $("#nightButton");
     var $lobby = $("#lobby");
     var $lobbyUserList = $("#lobbyUserList");
     var $lobbyUserListHeader = $("#lobbyUserListHeader")
     var $ReadyButtonForm = $("#ReadyButtonForm");
     var $ReadyButton = $("#ReadyButton");
     var $gameView = $("#gameView");
     var $nameAndRole = $("#nameAndRole");

     var myName;

var isNight = false;

//Makes background dark (should toggle?)
     $messageForm.on("click", "#nightButton", function(){
          if(isNight){
          $body.css("transition", "2s");
          $body.css("background-image", 'url(../css/daybg.png)');

          $nightButton.val("Day Time");

          isNight=false;
          }
          else{
               $body.css("transition", "2s");
               $body.css("background-image", 'url(../css/nightbg.png)');

               $nightButton.val("Night Time");

               isNight=true;
          }
     });

//Client submits username to server
function isAlphaNumeric(str) {
   var code;
   var len = str.length;
   for (var i = 0; i < len; i++) {
     code = str.charCodeAt(i);
     if (!(code > 47 && code < 58) && // numeric (0-9)
         !(code > 64 && code < 91) && // upper alpha (A-Z)
         !(code > 96 && code < 123)) { // lower alpha (a-z)
       return false;
     }
   }
   return true;
 };
 $usernameForm.submit(function(e){
      e.preventDefault();
      let name = $userInput.val().toString();
      if(isAlphaNumeric(name)){
        socket.emit("new user", name, function(data){
             if(data==0){
                  //switch to lobby view, change to day background
                  $introView.hide();
                  $body.css("transition", "1s");
                  $body.css("background-image", 'url(../css/daybg.png)');
                  $lobby.show();
                  myName = name;
             }
             if(data==1){
               alert("Username is taken!");
             }
             if(data==2){
                alert("Lobby is full!");
             }
        });
        $userInput.val("");
      }
      else{
        alert('Username is not alphanumeric!');
      }
 });

//Client receives user list from server
     socket.on("get users", function(data){
          html ="";
          $lobbyUserListHeader.html("Lobby (" + data.length + "/12) online");
          for(i=0; i<data.length; i++){
               if(data[i].ready){
                    html += '<li class="username-list-item   ready">' +data[i].name+'</li>';
               }
               else{
                    html += '<li class="username-list-item">' +data[i].name +'</li>';
               }
          }
          $users.html(html);
     });

//Client Sends message to server
     $messageForm.submit(function(e){
          e.preventDefault();
          socket.emit("send message", $message.val());
          $message.val("");
     });


//Client recieves message from server
     socket.on("new message", function(data){
          //prepend --> opposite order of append (so messages are at bottom)
          $chat.prepend('<div class="newMessage"><span class="username">'+data.user+': </span>'+data.msg+'</div>');
     });

     $ReadyButtonForm.on("click", "#ReadyButton", function(){
          socket.emit("ready user",  true);
     });
//client gets notified that the game is starting
     socket.on("start", function(/*send role*/){
          $lobby.hide();
          $nameAndRole.append('<span>' + myName +', your role is ' + /* add role*/ '</span>');
          $gameView.show();
          //probably more stuff here
     });
