
     var socket = io.connect();
     var $body = $("body");
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

//Makes background dark (should toggle?)
     $messageForm.on("click", "#nightButton", function(){
          $body.css("transition", "2s");
          $body.css("background-color", "#000000");
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
      if(isAlphaNumeric($userInput.val().toString())){
        socket.emit("new user", $userInput.val(), function(data){
             if(data){
                  $usernameForm.hide();
                  $lobby.show();
             }
        });
        $userInput.val("");
      }
      else{
        alert('Input is not alphanumeric');
      }
 });

//Client receives user list from server
     socket.on("get users", function(data){
          let html ="";
          $lobbyUserListHeader.html("Lobby (" + data.length + "/36) online");
          for(let i=0; i<data.length; i++){
               html += '<li class="username-list-item">' +data[i]+'</li>';
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
          $chat.append('<div class="newMessage"><span class="username">'+data.user+': </span>'+data.msg+'</div>');
     });
