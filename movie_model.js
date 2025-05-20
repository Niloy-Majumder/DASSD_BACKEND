const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String },
  director: { type: String },
  releaseYear: { type: Number },
  genre: { type: String },
  rating: { type: Number },
  description: { type: String },
  isDeleted: {type: Boolean},
});

const Movies = mongoose.model("Movie", movieSchema);

module.exports = Movies;
