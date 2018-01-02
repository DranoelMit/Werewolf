/* WereError: A general error in werewolf. The following class
serves as a guide for all following classes. When an exception is thrown, the 
following functionality is avaliable to you
*/
function WereError(errorCode,description)
{
    this.errorCode = errorCode;
    this.description = description;
    this.what = function()
    {
        return "Error: " + errorCode + " || " + description; 
    };
}

function UsernameMismatch()
{
    WereError.call(101,"Username mismatch")
}