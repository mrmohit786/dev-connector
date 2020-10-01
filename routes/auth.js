const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const { check } = require("express-validator");

const { signin, getUser } = require("../controllers/auth");

//NOTE    ROUTE
//@route  GET api/auth
//desc    get user data
//@access Private
router.get("/", auth, getUser);

//NOTE    ROUTE
//@route  POST api/auth
//@Ddesc  user sign in
//@access Public
router.post(
  "/",
  [
    check("email", "Please add a valid Email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  signin
);

module.exports = router;
