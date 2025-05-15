function checkAccess(...roles) {
  return function (req, res, next) {
    const userRole = req.role;

    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(403).send("Forbidden");
    }
  };
}

module.exports = checkAccess;
