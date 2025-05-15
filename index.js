const bodyParser = require("body-parser");
const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect("mongodb://localhost:27017/movies_DB")
  .then(async () => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use("/users", require("./user_router"));
app.use("/movies", require("./movie_router"));

app.listen(port, () => {
  console.log(`Basic Express App is running at http://localhost:${port}`);
});
