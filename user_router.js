const { Router } = require("express");

const userRouter = Router();

const User = require("./user_model");
const bcrypt = require("bcrypt");
const { signJwt } = require("./jwt");

userRouter.post("/register", async (req, res) => {
  const { password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ ...req.body, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: "User registered successfully" });
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const token = signJwt({ id: user._id, role: user.role });

  res.status(200).json({ token });
});

module.exports = userRouter;
