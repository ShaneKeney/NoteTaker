var express = require('express');
var fs = require('fs');
var path = require('path');
var { promisify } = require('util');
var uuid = require('uuid');

//Set up the Express app
var app = express();
var PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

//Create current notes from db
var currentNotes = [];
loadCurrentNotes(currentNotes);

//Basic route that send the user to the AJAX page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Gets any current notes in the db.json file
app.get("/api/notes", function(req, res) {
    console.log("api/notes endPoint hit\n");
    console.log("Current notes array: \n ------------- \n" + JSON.stringify(currentNotes))

    res.json(currentNotes);
});


// Post endpoint for saving notes
app.post("/api/notes", function(req, res) {
    console.log("/api/notes post endpoint hit!");
    console.log("Current notes array: \n ------------- \n" + JSON.stringify(currentNotes))
    let id = uuid();
    let newNote = { id: id, ...req.body }
    currentNotes.push(newNote);

    writeFile()

    res.json(newNote);
});


//TODO: delete endpoint
app.delete("/api/notes/:id", function(req, res) {
    //console.log("/api/notes/:id delete endpoint hit");

    let id = req.params.id;
    //console.log("Id to be deleted:    " + id)
    //console.log(req.body);

    currentNotes = currentNotes.filter((item) => {
        if(item.id === id) {
            console.log(true)
        } else {
            console.log(false)
        }
        return item.id !== id;
    })

    writeFile();

    res.sendStatus(200); //Just send OK response
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});

async function loadCurrentNotes(currentNotes) {
    fs.readFile('./db/db.json', function(err, data) {
        if(err) console.log("error");
        let notes = JSON.parse(data);
        notes.forEach((item) => {
            currentNotes.push(item);
        })
    })
}

const writeFile = () => {
    fs.writeFile("./db/db.json", JSON.stringify(currentNotes, null, 4), function(err) {
        if(err) return console.log("Error writing to file!");
        console.log("Successfully wrote to db.json");
    });
}
