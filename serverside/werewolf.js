/* Werewolf.js -- Server logic and async loops for gameplay
    [1] Code written as functions so it may be implemented with currrent server
*/
var game = {};
// Werewolf player roles
var RoleEnum = {
    WEREWOLF : 0,
    SEER : 1,
    VILLAGER : 2,
    HUNTER : 3,
    // Secondary roles. Will be implemented in next version
    PRIEST : 4,
    TANNER : 5,
    MINION : 6
}

game.GameConnection = function(username,clientObj) //is this supposed to be an object?
{
    this.username = username;
    this.clientObj = clientObj;
};
game.Player =function(gc,role) //is this supposed to be an object?
{
    this.gc = gc; // Specify the game connection used to connect this player
    this.role = role; // Specify the role of the player

};
/* EXAMPLE 1: Initialize a player
    var p1 = new Player({"Marcus42",connections[0]},RoleEnum.WEREWOLF)
*/
game.WerewolfGame = function(serverObj, ioObj, users, connectedSockets) //pseudo
{
     const NUM_WEREWOLVES = 2;
     const NUM_SEER = 1;

     const NUM_HUNTER = 1;
     console.log("Entering Werewolf Game...");
    this.serverObj = serverObj;
    this.ioObj = ioObj;
    // Recalculate the number of villagers
    var NUM_VILLAGER = users.length - NUM_WEREWOLVES - NUM_SEER - NUM_HUNTER;
    // Step 1: Determine random roles for each game connection
    this.players = new HashTable(25); // Create a hashtable with 24 buckets   //idk the plan here but its def not working
    // We must select two indices at random to be the werewolves.
    var sele = new Array(users); //sele is a copy of user array
    var conCopy = new Array(connectedSockets); // conCopy is a copy of the connections array
    var targLength = sele.length - NUM_WEREWOLVES; // There will be two
    var safetyCntr = 0; // Cannot be above 5 attempts
    var state = RoleEnum.WEREWOLF;
    while (sele.length > 0)
    {
        // Select random index. That user will become a werewolf
        var randIndex = Math.floor(Math.random() * sele.length) + 1;
        var username = sele[randIndex];
        var myGC = new GameConnection(username,connectedSockets[randIndex]); //what

        this.players.add({key:username,value: new Player(gc,RoleEnum.WEREWOLF)})
        // Remove the user and connection at those indices
        sele.splice(randIndex,1);
        conCopy.splice(randIndex,1);
        if (sele.length == targLength)
        {
            // We need to switch to the next state
            state += 1;
            if (state == RoleEnum.SEER) { targLength = sele.length - NUM_SEER}
            else if (state == RoleEnum.VILLAGER) { targLength = sele.length - NUM_VILLAGER}
            else if (state == RoleEnum.HUNTER) { targLength = sele.length - NUM_HUNTER}
            else {
                // We are done we should exit
                break;
            }
        }
    }

};
game.Start = function(){
// This is wherer the while loop will go
// should be called in server
};
// Players should be mapped into a map with dictionaries as elements
// to sort them for easy access

module.exports = game; //packages the pseudo constructor so it may be called elsewhere
