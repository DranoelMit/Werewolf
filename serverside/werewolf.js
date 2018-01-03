/* Werewolf.js -- Server logic and async loops for gameplay
    [1] Code written as functions so it may be implemented with currrent server
*/

// Werewolf player roles
RoleEnum = {
    WEREWOLF : 0,
    SEER : 1,
    VILLAGER : 2,
    HUNTER : 3,
    // Secondary roles. Will be implemented in next version
    PRIEST : 4,
    TANNER : 5,
    MINION : 6
}
function GameConnection(username,clientObj)
{
    this.username = username;
    this.clientObj = clientObj;
}
function Player(gc,role)
{
    this.gc = gc; // Specify the game connection used to connect this player
    this.role = role; // Specify the role of the player

}
/* EXAMPLE 1: Initialize a player
    var p1 = new Player({"Marcus42",connections[0]},RoleEnum.WEREWOLF)
*/
const NUM_WEREWOLVES = 2;
const NUM_SEER = 1;
const NUM_VILLAGER = 1;
const NUM_HUNTER = 1;
function WerewolfGame(serverObj,ioObj,users,connectedSockets)
{
    this.serverObj = serverObj;
    this.ioObj = ioObj;
    // Step 1: Determine random roles for each game connection
    if (users.length != connectedSockets.length)
    {
        // Throw an error: each connection MUST have a coresponding username!
        // Timmy why.....
        throw new UsernameMismatch();
    }

    this.players = new HashTable(25); // Create a hashtable with 24 buckets
    // We must select two indices at random to be the werewolves.
    var sele = new Array(users);
    var conCopy = new Array(connectedSockets);
    var targLength = sele.length - NUM_WEREWOLVES; // There will be two
    var safetyCntr = 0; // Cannot be above 5 attempts
    var state = RoleEnum.WEREWOLF;
    while (sele.length > 0)
    {
        // Select random index. That user will become a werewolf
        var randIndex = Math.floor(Math.random() * sele.length) + 1;
        var username = sele[randIndex];
        var myGC = new GameConnection(username,connectedSockets[randIndex]);

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
    this.Start = function(){

    };
}

// Players should be mapped into a map with dictionaries as elements
// to sort them for easy access
