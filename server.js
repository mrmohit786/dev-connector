const express = require("express");
const connectDB = require("./config/db");

//import routes
const userRoutes = require("./routes/api/user");
const profileRoutes = require("./routes/api/profile");
const postsRoutes = require("./routes/api/posts");
const authRoutes = require("./routes/api/auth");

//intialize express
const app = express();

//add body parser
app.use(express.json({ extends: true }));

//connect database
connectDB();

app.get("/", (req, res) => res.send("Hello Server"));

//use routes
app.use("/api/user", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
