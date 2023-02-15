const jwt = require("jsonwebtoken");

function verifyNWT(req, res, next) {
  const token = req.cookies && req.cookies["jwt"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = verifyNWT;
