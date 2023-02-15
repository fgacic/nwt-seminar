const express = require("express");
const app = express.Router();
const Beer = require("../models/beerModel");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/middleware");

// Find all beers
app.get("/", (req, res) => {
  console.log("asd");
  Beer.find({}, (error, beers) => {
    if (error) throw new Error();
    res.status(200).json(beers);
  });
});

// Find beer by id
app.get("/:id", async (req, res) => {
  try {
    const beers = await Beer.findById(req.params.id);
    if (!beers) {
      return res.status(400).json({ message: "Beer not found" });
    }
    return res.status(200).json(beers);
  } catch (error) {
    throw new error();
  }
});

// Save the new beer document to the database
app.post(
  "/",
  auth,

  [
    check("name").not().isEmpty().withMessage("Name is required"),
    check("price").not().isEmpty().withMessage("Price is required"),
    check("brewer").not().isEmpty().withMessage("Brewer is required"),
    check("abv").not().isEmpty().withMessage("Abv is required"),
    check("abv").isNumeric().withMessage("Abv should be a number"),
    check("price").isNumeric().withMessage("Price should be a number"),
    check("name").isString().withMessage("Name should be a string"),
    check("brewer").isString().withMessage("Brewer should be a string"),
    check("img").not().isEmpty().withMessage("img is required"),
    check("img")
      .isString()
      .isBase64()
      .withMessage("img should be a b64 encoded string"),
  ],

  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const newBeer = new Beer({
      name: req.body.name,
      abv: req.body.abv,
      brewer: req.body.brewer,
      price: req.body.price,
      img: req.body.img,
    });

    newBeer.save((error) => {
      if (error) {
        throw new Error(error);
      } else {
        res.status(200).json({
          message: "Beer saved sucessfully",
          _id: newBeer._id.toString(),
        });
      }
    });
  }
);

//Delete beer by id
app.delete("/:id", auth, async (req, res) => {
  try {
    const beers = await Beer.findByIdAndDelete(req.params.id);
    if (!beers) {
      return res.status(404).send("Beer not found");
    }
    res.send(`Beer with id ${req.params.id} is deleted`);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update a beer document
app.put(
  "/:id",
  auth,
  [
    check("name").isString().withMessage("Name should be a string"),
    check("abv").isNumeric().withMessage("Abv should be a number"),
    check("brewer").isString().withMessage("Brewer should be a string"),
    check("abv").isNumeric().withMessage("Abv should be a number"),
  ],
  async (req, res) => {
    try {
      const beers = await Beer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!beers) {
        return res.status(404).send("Beer not found");
      }
      res.status(200).json(beers);
    } catch (error) {
      throw new Error(error);
    }
  }
);

module.exports = app;
