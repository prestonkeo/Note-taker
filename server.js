var express = require("express");
var path = require("path");
var fs = require("fs");
const { create } = require("domain");
const { errorMonitor } = require("events");
const uuidv1 = require("uuidv1");


var app = express();
var PORT = process.env.PORT || 3080;

app.use(express.static("./public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    var notesJSON = [].concat(JSON.parse(data));
    return res.json(notesJSON);
  });
});

app.post("/api/notes", function (req, res) {
  const { title, text } = req.body;
  const newNote = { title, text, id: uuidv1() };
  var foo;
  
  fs.readFile("db/db.json", "utf8", function (err, data) {
    parsedNotes = [].concat(JSON.parse(data));
    if (err) throw err;
    foo = [...parsedNotes, newNote];
    fs.writeFile("db/db.json", JSON.stringify(foo), function () {
      return res.send("note updated");
    });
  });
});

app.delete("/api/notes/:id", function (req, res) {
  var parameters = req.params.id;
  console.log(parameters);
 
  fs.readFile("db/db.json", "utf8", function (err, data) {
    parsedNotes = [].concat(JSON.parse(data));
    console.log(parsedNotes[0].id);
    if (err) throw err;

    parsedNotes = parsedNotes.filter(function (item) {
      return item.id !== parameters;
    });

    fs.writeFile("db/db.json", JSON.stringify(parsedNotes), function () {
      return res.send("note updated");
    });
  });
});

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});