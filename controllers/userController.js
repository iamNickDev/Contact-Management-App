const { response } = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//@desc Register the contacts
//@route Post /api/contacts
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(404);
    throw new Error("All Fields are required");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed password:", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log("User created succesfully:", user);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(401);
    throw new Error("User data is not valid");
  }
  res.json({ hashedPassword });
});

//@desc Login the contacts
//@route Post /api/contacts
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const user = await User.findOne({ email });
  console.log("🚀 ~ file: userController.js:51 ~ loginUser ~ user:", user);
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRATE,
      { expiresIn: "1m" }
    );
    console.log(
      "🚀 ~ file: userController.js:64 ~ loginUser ~ accessToken:",
      accessToken
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});

//@desc Current user indor the contacts
//@route Get /api/contacts
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json({ message: "Current User info" });
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
};
