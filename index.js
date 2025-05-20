const bodyParser = require("body-parser");
const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");
const Movies = require("./movie_model");
const movies = require("./movies")
const cors = require("cors")

const app = express();
const port = 4040;

const options = {
  origin: 'http://localhost:5173',
}
app.use(cors(options))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public',express.static(path.join(__dirname, "public")));

mongoose
  .connect("mongodb://localhost:27017/movies_DB")
  .then(async () => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Init Movies
movies.forEach(async movie => {
  if (await Movies.exists(movie) == null) {
    await new Movies(movie).save()
  }
});


app.use("/users", require("./user_router"));
app.use("/movies", require("./movie_router"));

app.listen(port, () => {
  console.log(`Basic Express App is running at http://localhost:${port}`);
});
