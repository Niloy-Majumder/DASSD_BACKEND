const { decodeJwt } = require("./jwt");

const authMiddleware = (req, res, next) => {
  const bearerToken = req.headers["authorization"];
  const token = bearerToken && bearerToken.split(" ")[1];
  let isAuthenticated = true;

  isAuthenticated = decodeJwt(token);
  if (isAuthenticated) {
    req.user = isAuthenticated.user;
    req.role = isAuthenticated.role;
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = authMiddleware;
