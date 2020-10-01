const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { signup } = require("../controllers/auth");

//NOTE
//@route  POST api/user
//@Ddesc  user sign up
//@access Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please add a valid Email").isEmail(),
    check(
      "password",
      "Please enter password with minimum 6 characters"
    ).isLength({ min: 6 }),
  ],
  signup
);
module.exports = router;
