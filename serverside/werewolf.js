/* Werewolf.js -- Server logic and async loops for gameplay
    [1] Code written as functions so it may be implemented with currrent server
*/
//packaged essential parts of the game into an export
var game = {};
// Werewolf player roles
var RoleEnum = {
    WEREWOLF : 0,
    SEER : 1,
    HUNTER : 2,
    VILLAGER : 3,
    // Secondary roles. Will be implemented in next version
    PRIEST : 4,
    TANNER : 5,
    MINION : 6
}

/* EXAMPLE 1: Initialize a player
    var p1 = new Player({"Marcus42",connections[0]},RoleEnum.WEREWOLF)
*/
game.WerewolfGameConstruct = function(users) //pseudo
{
     console.log("Entering Werewolf Game...");
     const NUM_WEREWOLVES = 2;
     const NUM_SEER = 1;
     const NUM_HUNTER = 1;
     const NUM_VILLAGER = users.length - NUM_WEREWOLVES - NUM_SEER - NUM_HUNTER;

    // Step 1: Determine random roles for each game connection
    this.players = []// new HashTable(25); // Create a hashtable with 24 buckets   //idk the plan here but its def not working
    // We must select two indices at random to be the werewolves.
    var sele = []; //sele is a copy of user array  //new Array DOES NOT COPY, adds array into an array
         for(i=0; i<users.length; i++){
           sele[i] = users[i];
         }
    var targLength = sele.length - NUM_WEREWOLVES; // There will be two
    var state = RoleEnum.WEREWOLF;
    while (sele.length > 0)
    {
        // Select random index. That user will become a werewolf
        var randIndex = Math.floor(Math.random() * sele.length); //if changed to hash add +1
        var username = sele[randIndex];


        this.players.push({key:username,role:state})          //this.players.add({key:username,value: new Player(gc,RoleEnum.WEREWOLF)})
        // Remove the user and connection at those indices
        console.log(sele.length);
        sele.splice(randIndex,1);

        conCopy.splice(randIndex,1);
        if(sele.length == targLength){
            // We need to switch to the next state
            state += 1;
            if (state == RoleEnum.SEER) { targLength = sele.length - NUM_SEER}
            else if (state == RoleEnum.HUNTER) { targLength = sele.length - NUM_HUNTER}
            else if (state == RoleEnum.VILLAGER) { targLength = sele.length - NUM_VILLAGER}
            else {}
         }
            // We are done we should exit,  eh it do that for us
    }
    console.log("Roles complete, the roles are as follows: ")
 for(i=0; i<this.players.length;i++){
       console.log(this.players[i].key + " is a " + this.players[i].role);
 }

};
game.Start = function(){
// This is wherer the while loop will go
// should be called in server
};
// Players should be mapped into a map with dictionaries as elements
// to sort them for easy access

module.exports = game; //packages the pseudo constructor so it may be called elsewhere
