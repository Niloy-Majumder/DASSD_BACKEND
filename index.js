const bodyParser = require("body-parser");
const express = require("express");
const FileSystem = require("fs");
const path = require("path");
const movies = require("../movies.js");

require("dotenv").config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/movies/", (req, res) => {
  try {
    res.send(movies);
  } catch (error) {
    res.status(500).send("An error occurred");
  }
});

app.get("/movies/:id", (req, res) => {
  try {
    const movie = movies.find((m) => m.id === parseInt(req.params.id));
    if (movie) {
      res.send(movie);
    } else {
      res.status(404).send("Movie not found");
    }
  } catch (error) {
    res.status(500).send("An error occurred");
  }
});

app.post("/movies/", (req, res) => {
  try {
    const data = req.body;

    const newMovie = {
      id: movies.length + 1,
      title: data.title,
      director: data.director,
      releaseYear: data.releaseYear,
      genre: data.genre,
      rating: data.rating,
      description: data.description,
    };

    movies.push(newMovie);
    FileSystem.writeFileSync("data.js", `export const movies = ${JSON.stringify(movies, null, 2)};`);

    res.status(201).send(newMovie);
  } catch (error) {
    res.status(500).send("An error occurred");
  }
});

app.put("/movies/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const movieIndex = movies.findIndex((m) => m.id === id);
    if (movieIndex === -1) {
      return res.status(404).send("Movie not found");
    }

    const updatedMovie = {
      ...movies[movieIndex],
      title: data.title,
      director: data.director,
      releaseYear: data.releaseYear,
      genre: data.genre,
      rating: data.rating,
      description: data.description,
    };

    movies[movieIndex] = updatedMovie;
    FileSystem.writeFileSync("data.js", `export const movies = ${JSON.stringify(movies, null, 2)};`);
    res.send(updatedMovie);
  } catch (error) {
    res.status(500).send("An error occurred");
  }
});

app.delete("/movies/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const movieIndex = movies.findIndex((m) => m.id === id);
    if (movieIndex === -1) {
      return res.status(404).send("Movie not found");
    }
    movies.splice(movieIndex, 1);
    FileSystem.writeFileSync("data.js", `export const movies = ${JSON.stringify(movies, null, 2)};`);

    res.send(`Deleted Movie with ID: ${id}`);
  } catch (error) {
    res.status(500).send("An error occurred");
  }
});

app.listen(port, () => {
  console.log(`Basic Express App is running at http://localhost:${port}`);
});
