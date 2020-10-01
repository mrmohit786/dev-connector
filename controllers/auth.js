const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const gravatar = require("gravatar");

//NOTE    CONTROLLER
//@route  POST api/auth
//@Ddesc  user sign in
//@access Public
exports.signin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          throw err;
        }
        return res.send({ token });
      }
    );
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server Error");
  }
};

//NOTE    CONTROLLER
//@route  POST api/user
//@Ddesc  user sign up
//@access Public
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  try {
    //check existing user
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exist" }] });
    }

    //create avatar
    const avatar = gravatar.url("email", { s: "200", r: "pg", d: "mm" });

    //create new user
    user = new User({ name, email, avatar, password });

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          throw err;
        }
        res.send({ token });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
};

//NOTE    CONTROLLER
//@route  GET api/auth
//desc    get user data
//@access Private
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log("auth :" + err.message);
    res.status(500).send({ msg: "Server Error" });
  }
};
