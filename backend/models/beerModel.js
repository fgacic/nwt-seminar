const mongoose = require("mongoose");

// Create the Beer schema
const BeerSchema = new mongoose.Schema({
  name: String,
  brewer: String,
  abv: Number,
  price: Number,
  img: String,
});

// Create the Beer model
const Beer = mongoose.model("Beer", BeerSchema);

module.exports = Beer;
