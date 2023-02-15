const mongoose = require("mongoose");

// Create the User schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role:String
});

// Create the User model
const User = mongoose.model("User", UserSchema);

module.exports = User;
