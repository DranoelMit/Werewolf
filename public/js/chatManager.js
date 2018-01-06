//selectors
     var socket = io.connect();
     var $body = $("body");
     var $introView = $("#introView");
     var $loginErr = $("#loginErr");
     var $lobbyChatArea = $("#chatArea");
     var $lobbyMessageForm = $("#lobbyMessageForm");
     var $lobbyChatInput = $("#lobbyChatInput");
     var $lobbyChat = $("#lobbyChat");
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
     var $villageChat = $("#villageChat");
     var $villageChatForm = $("#villageChatForm");
     var $villageChatInput = $("#villageChatInput");
     var $promptZone = $("promptZone");
     var $dayForm = ("#dayForm");

//not selectors
     var myName;
     var myRole;
     var serverPlayerList;
     var currentChat;
     var isNight = false;


//Makes background dark (should toggle?)
     $lobbyMessageForm.on("click", "#nightButton", function(){
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
                  currentChat = $lobbyChat;
                  $lobby.show();
                  myName = name;
             }
             if(data==1){
               $loginErr.html("Username is taken!");
                $loginErr.css("visibility", "visible");
             }
             if(data==2){
                $loginErr.html("Lobby is full!");
                $loginErr.css("visibility", "visible");
             }
        });
        $userInput.val("");
      }
      else{
           $loginErr.html("Username is not alphanumeric!")
           $loginErr.css("visibility", "visible");
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
     $lobbyMessageForm.submit(function(e){
          e.preventDefault();
          if($lobbyChatInput.val()!=""){
              socket.emit("send message", $lobbyChatInput.val());
              $lobbyChatInput.val("");
          }
     });
//Client sends message to server (in game)
     $villageChatForm.submit(function(e){
          e.preventDefault();
          if($villageChatInput.val() !="") {
               socket.emit("send message", $villageChatInput.val());
               $villageChatInput.val("");
          }
     });


//Client recieves message from server
     socket.on("new message", function(data){
          //prepend --> opposite order of append (so messages are at bottom)
          //TODO store $lobbyChat in a currentChat variable, CHNAGE this to point at villageChat once game starts
          currentChat.prepend('<div class="newMessage"><span class="username">'+data.user+': </span>'+data.msg+'</div>');
     });

     $ReadyButtonForm.on("click", "#ReadyButton", function(){
          socket.emit("ready user",  true);
     });
//client gets notified that the game is starting
     socket.on("start", function(playerList){

          serverPlayerList = playerList;

          $lobby.hide();
          for(var i=0; i<playerList.length;i++){
               if(myName==playerList[i].name){
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
          currentChat = $villageChat;
          $gameView.show();
     });

     socket.on("day", function(){

          $promptZone.prepend("<p> Who do you vote to lynch? </p>");
          let dayForm = '<form id="dayForm"></form>';
          $promptZone.append(dayForm);
          //$dayForm = $("#dayForm");
          for(i=0; i<serverPlayerList; i++){
               if(serverPlayerList[i].alive)
                    $dayForm.append('<input type="radio" value="'+ serverPlayerList[i].name +'"/><span>' + serverPlayerList[i].name + '</span><br>');
          }
          $dayForm.append('<input id="dayFormButton" type="button" value="Vote"/>');
     });
