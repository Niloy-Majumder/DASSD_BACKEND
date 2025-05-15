const jwt = require("jsonwebtoken");
require("dotenv").config();

const { JWT_SECRET } = process.env;

function signJwt(payload) {
  return jwt.sign(payload, JWT_SECRET, { algorithm: "HS256", expiresIn: "2h" });
}

function decodeJwt(token) {
  try {
    return jwt.decode(token, JWT_SECRET);
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

module.exports = {
  signJwt,
  decodeJwt,
};
