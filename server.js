const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

//import routes
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const postsRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");

//intialize express
const app = express();

//add body parser
app.use(express.json({ extends: true }));

//connect database
connectDB();

//use routes
app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/auth", authRoutes);

//serve static assets in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Up:${PORT}`));
