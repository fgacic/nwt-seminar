const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const BrewerSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  country: String,
  description: String,
  url: String,
  born: Number,
  img: String,
});

BrewerSchema.plugin(uniqueValidator);

const Brewer = mongoose.model("Breweries", BrewerSchema);

module.exports = Brewer;
