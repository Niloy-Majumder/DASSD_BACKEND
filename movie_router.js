const { Router } = require("express");
const Movies = require("./movie_model");
const movieRouter = Router();

const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");

const authMiddleware = require("./auth");
const checkAccess = require("./access_control");

const upload = multer({ dest: "public/images" });

movieRouter.get("/", authMiddleware, checkAccess("user", "admin"), async (req, res) => {
  try {
    res.send(await Movies.find());
  } catch (error) {
    console.error(error);

    res.status(500).send("An error occurred");
  }
});

movieRouter.get("/search", authMiddleware, checkAccess("user", "admin"), async (req, res) => {
  try {
    console.log(req.query);

    const { title, director, releaseYear, genre } = req.query;

    const query = {};
    if (title) query.title = title;
    if (director) query.director = director;
    if (releaseYear) query.releaseYear = releaseYear;
    if (genre) query.genre = genre;
    query.isDeleted = query.isDeleted ? query.isDeleted : false;
    const movies = await Movies.find(query);
    res.send(movies);
  } catch (error) {
    console.log(error);

    res.status(500).send("An error occurred");
  }
});

movieRouter.get("/:id", authMiddleware, checkAccess("user", "admin"), async (req, res) => {
  try {
    const movie = await Movies.findById(req.params.id);
    if (movie) {
      res.send(movie);
    } else {
      res.status(404).send("Movie not found");
    }
  } catch (error) {
    res.status(500).send("An error occurred");
  }
});

movieRouter.post("/", authMiddleware, checkAccess("admin"), async (req, res) => {
  try {
    const data = req.body;
    if (await Movies.exists(data) == null) {
      const newMovie = new Movies({
        title: data.title,
        director: data.director,
        releaseYear: data.releaseYear,
        genre: data.genre,
        rating: data.rating,
        description: data.description,
        isDeleted: false
      });

      await newMovie.save();
      res.status(201).send(newMovie);
    }
      res.status(201).send(`${data.title} already exists.`);


  } catch (error) {
    res.status(500).send("An error occurred");
  }
});

movieRouter.post("/image/:id", authMiddleware, checkAccess("admin"), upload.single("file"), async (req, res) => {
  try {
    const movie = await Movies.findById(req.params.id);
    if (!movie) {
      return res.status(404).send("Movie not found");
    }

    exec(`mv ${req.file.path} public/images/${movie.title}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error moving file: ${error.message}`);
        return res.status(500).send("An error occurred");
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(500).send("An error occurred");
      }
      console.log(`stdout: ${stdout}`);

      res.send({
        message: "File uploaded successfully",
        filePath: `/images/${movie.title}`,
      });
    });
  } catch (error) { }
});

movieRouter.get("/image/:id", authMiddleware, checkAccess("user", "admin"), async (req, res) => {
  try {
    const movie = await Movies.findById(req.params.id);

    console.log(movie);

    res.sendFile(path.join(__dirname, `public/images/${movie.title}`));
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

movieRouter.put("/:id", authMiddleware, checkAccess("user", "admin"), async (req, res) => {
  try {
    const data = req.body;
    const movie = await Movies.findById(req.params.id);

    if (!movie) {
      return res.status(404).send("Movie not found");
    }

    const updatedMovie = await Movies.updateOne(
      { _id: req.params.id },
      {
        title: data.title,
        director: data.director,
        releaseYear: data.releaseYear,
        genre: data.genre,
        rating: data.rating,
        description: data.description,
      },
      {
        new: true,
      }
    );

    res.send(updatedMovie);
  } catch (error) {
    res.status(500).send("An error occurred");
  }
});

movieRouter.delete("/:id", authMiddleware, checkAccess("admin"), async (req, res) => {
  try {
    // await Movies.deleteOne({ _id: req.params.id });
    const movie = await Movies.findById(req.params.id);
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    const updatedMovie = await Movies.updateOne(
      { _id: req.params.id },
      {
        isDeleted: true,
      }
    );

    res.send(`Deleted Movie with ID: ${req.params.id}`);
  } catch (error) {
    console.log(error);

    res.status(500).send("An error occurred");
  }
});

module.exports = movieRouter;
