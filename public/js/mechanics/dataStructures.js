/* Definition for a Hashtable which uses the linked list
conflict resolution approach
*/
function hash_string(str) {
    var hash = 7;
    if (typeof str !== 'string')
    {
        throw new InvalidType();
    }
    for (i = 0; i < str.length;i++)
    {
        hash = hash * 31 + str.charAt(i);
    }
    return hash;
}

function HashTable(numBuckets)
{
    this.table = new Array(numBuckets) // Represents the table
    for (i = 0; i < numBuckets;i++)
    {
        // Each slot in the array holds a space for list
        table[i] = new Array();
    }
    // Inserts element into hashtable. The first element in pair
    // is used to determine the index
    
    this.add = function(pair,hashFunc)
    {
        
        var index = hashFunc() % this.numBuckets;
        if (typeof pair !== {key,value})
        {
            throw new InvalidPair();
        } 
        // Check to see if the element already exists at index
        for (i = 0; i < table[index].length;i++)
        {
            if (table[index][i] == pair.value)
            {
                throw new ItemAlreadyExists();
            }
        }
        // Item did not exist, put it at the end of that array
        table[index].push(value);
        
    };
    
    // Removes element from hashtable
    this.remove = function(pair,hashFunc)
    {
        var index = hashFunc() % this.numBuckets;
        if (typeof pair !== {key,value})
        {
            throw new InvalidPair();
        }
        for (i = 0; i < table[index].length;i++)
        {
            if (table[index][i] == pair.value)
            {
                table[index].splice(i);
                
            }
        }
       
    };

}