const express = require("express");
const app = express.Router();
const Brewer = require("../models/brewerModel");
const { check, validationResult } = require("express-validator");
const checkJWT = require("../authorize");
require("dotenv").config();

// Find all breweries
app.get("/", (req, res) => {
  Brewer.find({}, (error, brewers) => {
    if (error) throw new Error();
    res.status(200).json(brewers);
  });
});

// Find brewery by id
app.get("/id/:id", async (req, res) => {
  try {
    const breweries = await Brewer.findById(req.params.id);
    if (!breweries) {
      return res.status(400).json({ message: "Brewery not found" });
    }
    return res.status(200).json(breweries);
  } catch (error) {
    throw new error();
  }
});

// Find brewery by name
app.get("/:name", async (req, res) => {
  try {
    const breweries = await Brewer.find({ name: req.params.name });
    if (!breweries) {
      return res.status(400).json({ message: "Brewery not found" });
    }
    return res.status(200).json(breweries);
  } catch (error) {
    throw new error();
  }
});

// Save the new brewery document to the database
app.post(
  "/",
  checkJWT,
  [
    check("name").not().isEmpty().withMessage("Name is required"),
    check("country").not().isEmpty().withMessage("Country is required"),
    check("description").not().isEmpty().withMessage("Description is required"),
    check("url").not().isEmpty().withMessage("Url is required"),
    check("born").not().isEmpty().withMessage("Born is required"),
    check("name").isString().withMessage("Name should be a string"),
    check("country").isString().withMessage("Country should be a string"),
    check("description")
      .isString()
      .withMessage("Description should be a string"),
    check("url")
      .isString()
      .isURL()
      .withMessage("Url should be a valid url string"),
    check("born").isNumeric().withMessage("Born should be a number"),
    check("img")
      .isString()
      .isBase64()
      .withMessage("img should be b64 encoded string"),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const newBrewery = new Brewer({
      name: req.body.name,
      country: req.body.country,
      description: req.body.description,
      url: req.body.url,
      born: req.body.born,
      img: req.body.img,
    });

    newBrewery.save((error) => {
      if (error) {
        return res.status(400).send({
          message: error.message,
        });
      } else {
        res.status(200).json({
          message: "Brewery saved sucessfully",
          id: newBrewery._id.toString(),
        });
      }
    });
  }
);

//Delete brewery by id
app.delete("/:id", async (req, res) => {
  try {
    const breweries = await Brewer.findByIdAndDelete(req.params.id);
    if (!breweries) {
      return res.status(404).send("Brewery not found");
    }
    res.send(`Brewery with id ${req.params.id} is deleted`);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update a brewery
app.put(
  "/:id",
  [
    check("name").isString().withMessage("Name should be a string"),
    check("country").isString().withMessage("Country should be a string"),
    check("description")
      .isString()
      .withMessage("Description should be a string"),
    check("url")
      .isString()
      .isURL()
      .withMessage("Url should be a string of url"),
    check("born").isNumeric().withMessage("Born should be a number"),
  ],
  async (req, res) => {
    try {
      const breweries = await Brewer.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (!breweries) {
        return res.status(404).send("Brewery not found");
      }
      res.status(200).json(breweries);
    } catch (error) {
      throw new Error(error);
    }
  }
);

module.exports = app;
