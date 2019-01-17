const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const path = require("path");

const db = require("./db");
const collection = "todo";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/getTodos", (req, res) => {
  db.getDB()
    .collection(collection)
    .find({})
    .toArray((err, document) => {
      if (err) {
        console.log(err);
      } else {
        console.log(document);
        res.json(document);
      }
    });
});

app.put("/:id", (req, res) => {
  const todoId = req.params.id;
  const userInput = req.body;

  db.getDB()
    .collection(collection)
    .findOneAndUpdate(
      { _id: db.getPrimaryKey(todoId) },
      { $set: { todo: userInput.todo } },
      { returnOriginal: false },
      (err, result) => {
        if (err) console.log(err);
        else res.json(result);
      }
    );
});

//insert
app.post("/", (req, res) => {
  const userInpit = req.body;
  db.getDB()
    .collection(collection)
    .insertOne(userInpit, (err, result) => {
      if (err) console.log(err);
      else {
        res.json({ result: result, document: result.ops[0] });
      }
    });
});

//delete
app.delete("/:id", (req, res) => {
  const todoId = req.params.id;

  db.getDB()
    .collection(collection)
    .findOneAndDelete({ _id: db.getPrimaryKey(todoId) }, (err, result) => {
      if (err) console.log(err);
      else res.json(result);
    });
});

db.connect(err => {
  if (err) {
    console.log("unable to connect to database");
    process.exit(1);
  } else {
    app.listen(3000, () => {
      console.log("connected to datatbase, app listening port 3000");
    });
  }
});
