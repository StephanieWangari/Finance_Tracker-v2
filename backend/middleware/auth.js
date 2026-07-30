const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const raw = req.header("Authorization");
  const token = raw?.startsWith("Bearer ") ? raw.slice(7) : raw;

  if (!token) return res.status(401).json("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).json("Invalid Token");
  }
};