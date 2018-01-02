
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

     $messageForm.on("click", "#nightButton", function(){
          $body.css("transition", "2s");
          $body.css("background-color", "#000000");
     });

     $usernameForm.submit(function(e){
          e.preventDefault();
          socket.emit("new user", $userInput.val(), function(data){
               if(data){
                    $usernameForm.hide();
                    $chatArea.show();
               }
          });
          $userInput.val("");
     });

     $messageForm.submit(function(e){
          e.preventDefault();
          socket.emit("send message", $message.val());
          $message.val("");
     });
     socket.on("get users", function(data){
           html ="";
          for( i=0; i<data.length; i++){
               html += '<li class="username-list-item">' +data[i]+'</li>';
          }
          $users.html(html);
     });

     socket.on("new message", function(data){
          $chat.append('<div class="newMessage"><span class="username">'+data.user+': </span>'+data.msg+'</div>');
     });
