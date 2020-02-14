var express = require('express');
var fs = require('fs');
var path = require('path');

//Set up the Express app
var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

//Basic route that send the user to the AJAX page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
