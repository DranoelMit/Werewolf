//selectors
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
//not selectors
     var myName;
     var myRole;

var isNight = false;

//Makes background dark (should toggle?)
     $messageForm.on("click", "#nightButton", function(){
          if(isNight){
          $body.css("transition", "2s");
          $body.css("background-image", 'url(../css/daybg.png)');
          $body.css("background-color", "#6A56F4");


          $nightButton.val("Day Time");

          isNight=false;
          }
          else{
               $body.css("transition", "2s");
               $body.css("background-image", 'url(../css/nightbg.png)');
               $body.css("background-color", "#615A91");

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
      if(isAlphaNumeric(name) && name.length>0){
        socket.emit("new user", name, function(data){
             if(data==0){
                  //switch to lobby view, change to day background
                  $introView.hide();
                  $body.css("transition", "1s");
                  $body.css("background-image", 'url(../css/daybg.png)');
                  $body.css("background-color", "#6A56F4");
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
          //TODO store $chat in a currentChat variable, CHNAGE this to point at villageChat once game starts
          $chat.prepend('<div class="newMessage"><span class="username">'+data.user+': </span>'+data.msg+'</div>');
     });

     $ReadyButtonForm.on("click", "#ReadyButton", function(){
          socket.emit("ready user",  true);
     });
//client gets notified that the game is starting
     socket.on("start", function(playerList){
          $lobby.hide();
          for(var i=0; i<playerList.length;i++){
               if(myName==playerList[i].key){
                 myRole = playerList[i].role;
               }
          }
          let wordRole;
          let roleDecrip;
          if(myRole==0){
            wordRole = "Werewolf";
           // roleDecrip = "Eat a villager each night";
          }
          if(myRole==1){
            wordRole = "Seer";
            //roleDecrip = "Each night, point at a player and learn if they are a werewolf";
          }
          if(myRole==2){
            wordRole = "Hunter";
           // roleDecrip = "If you are killed, take someone down with you";
          }
          if(myRole==3){
            wordRole = "Villager";
           // roleDecrip = "Find the werewolves and lynch them";
          }

          $nameAndRole.append('<span>' + myName +', your role is ' + wordRole + '</span>');
          $gameView.show();
          //probably more stuff here
     });
