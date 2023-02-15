const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
let app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3001", credentials: true }));
require("dotenv").config();
const beerController = require("./controllers/beerController");
const brewerController = require("./controllers/brewerController");
const userController = require("./controllers/userController");

mongoose.connect(
  "mongodb+srv://root:PNAOU22O42omPxEu@cluster0.kkk7fjk.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use("/beers", beerController);
app.use("/brewery", brewerController);
app.use("/auth", userController);

app.listen(process.env.PORT);
