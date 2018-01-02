/* Werewolf.js -- Server logic and async loops for gameplay
    [1] Code written as functions so it may be implemented with currrent server
*/

// Werewolf player roles
RoleEnum = {
    WEREWOLF : 0, 
    SEER : 1,
    VILLAGER : 2,
    HUNTER : 3,
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
    this.players = new Array()
    for (i = 0; i < users.length;i++)
    {

    }
    this.Start = function(){

    };
}

// Players should be mapped into a map with dictionaries as elements
// to sort them for easy access
