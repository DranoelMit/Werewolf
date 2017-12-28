var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");


var app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//body parser middleware for json files or urls
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//set static path(website), this is where you would put any html/css
//this will override any other response
 app.use(express.static(path.join(__dirname, "client")));


//express middleware
app.get("/", function(req, res)
{
//     res.json(object); sends json
//     res.send(text?)

     res.render("index",
     {
          //json of what you want to send to be rendered
          title: "Werewolf Express app"
     }
     );
});

//start the server to listen at a given port
app.listen(8080,() => console.log("Hosted on port 8080"));
