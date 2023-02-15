const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

const checkJWT = (req, res, next) => {
  if (process.env.USE_AUTH === "true") {
    if (!req.cookies || !cookies.access_token) {
      return res.status(401).send("Unauthorized: No token provided");
    }

    const token = req.cookies.access_token.split(" ")[1];

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).send("Unauthorized: Invalid token");
      }
      if (req.body.role && req.body.role === "admin" && decoded.role != "admin")
        return res.status(401).send("Unauthorized: Insufficent privileges");
    });
  }
  next();
};

module.exports = checkJWT;
