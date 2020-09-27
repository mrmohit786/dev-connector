const mongoose = require("mongoose");
const config = require("config");

const db = config.get("mongoDB");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
