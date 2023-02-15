const express = require("express");
const app = express.Router();
const User = require("../models/userModel");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

(req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    role: role,
  });

  const expiresIn = process.env.JWT_EXPIRATION;
  const expiresTime = new Date(Date.now() + 60 * 60 * 1000); // expires in 1 hour
  const token = jwt.sign(req.body, process.env.SECRET_KEY, { expiresIn });

  newUser.save((error) => {
    if (error) {
      throw new Error(error);
    } else {
      res.cookie("access_token", token, {
        sameSite: "strict",
        expiresTime,
      });
      res.status(200).json({
        message: "User registration sucessful",
      });
    }
  });
};

app.post(
  "/register",
  [
    check("username").not().isEmpty().withMessage("Username is required"),
    check("username").isString().withMessage("Username should be a string"),
    check("password").not().isEmpty().withMessage("Password is required"),
    check("role").not().isEmpty().withMessage("Role is required"),
    check("role").isIn(["user", "admin"]),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
      role: req.body.role,
    });

    const expiresIn = process.env.JWT_EXPIRATION;
    const expiresTime = new Date(Date.now() + 60 * 60 * 1000); // expires in 1 hour
    const token = jwt.sign(req.body, process.env.SECRET_KEY, { expiresIn });

    newUser.save((error) => {
      if (error) {
        throw new Error(error);
      } else {
        res.cookie("access_token", token, {
          // httpOnly: true,
          sameSite: "strict",
          expiresTime,
        });
        res.status(200).json({
          message: "User registration sucessful",
        });
      }
    });
  }
);

app.post(
  "/login",
  [
    check("username").not().isEmpty().withMessage("username is required"),
    check("username").isString().withMessage("username should be a string"),
    check("password").not().isEmpty().withMessage("password is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    User.findOne({ username: req.body.username }, (err, user) => {
      if (!user) {
        console.log(err);
        return res.status(404).send("User not found");
      }
      if (user.password != req.body.password) {
        return res.status(401).send("Wrong password");
      } 

      const payload = req.body;
      payload.id = user._id.toString();
      console.log(payload);

      const expiresIn = process.env.JWT_EXPIRATION;
      const expiresTime = new Date(Date.now() + 60 * 60 * 1000); // expires in 1 hour
      const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn });

      res.set("Set-Cookie", `jwt=${token}; Path=/;`);
      res.status(200).json({
        message: "User login sucessful",
      });
    });
  }
);

module.exports = app;
