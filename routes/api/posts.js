const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Post = require("../../models/Post");
const User = require("../../models/User");
const Profile = require("../../models/Profile");

//NOTE
//@route  POST api/posts
//@desc  Create a Post
//@access  Private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ _id: req.user.id }).select("-password");

      const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        avatar: user.avatar,
        name: user.name,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//NOTE
//@route  GET api/posts
//@desc  get all Post
//@access  Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

//NOTE
//@route  GET api/posts/:id
//@desc  get all Post
//@access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      return res.status(404).json({ msg: "Post not Found" });
    }

    res.json(post);
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not Found" });
    }
    res.status(500).send("Server Error");
  }
});

//NOTE
//@route  DELETE api/posts/:id
//@desc  delete a Post
//@access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    //post not found
    if (!post) {
      return res.status(404).json({ msg: "Post not Found" });
    }

    //check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (error) {
    console.log(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not Found" });
    }
    res.status(500).send("Server Error");
  }
});

//NOTE
//@route  PUT api/posts/like/:id
//@desc  like a post
//@access  Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const posts = await Post.findOne({ _id: req.params.id });
    //check if the post has already been liked
    if (
      posts.likes.filter((like) => like.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    posts.likes.unshift({ user: req.user.id });
    await posts.save();

    res.json(posts.likes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

//NOTE
//@route  PUT api/posts/unlike/:id
//@desc  unlike a post
//@access  Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const posts = await Post.findOne({ _id: req.params.id });
    //check if the post has already been liked
    if (
      posts.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post not liked" });
    }

    //get remove index
    const removeIndex = posts.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    posts.likes.splice(removeIndex, 1);

    await posts.save();

    res.json(posts.likes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

//NOTE
//@route  POST api/posts/comment/:id
//@desc  Comment on a post
//@access  Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ _id: req.user.id }).select("-password");
      const post = await Post.findOne({ _id: req.params.id });
      const newComment = new Post({
        user: req.user.id,
        text: req.body.text,
        avatar: user.avatar,
        name: user.name,
      });

      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//NOTE
//@route  DELETE api/posts/comment/:id/:comment_id
//@desc  delete a comment
//@access  Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const posts = await Post.findOne({ _id: req.params.id });

    //get comment
    const comment = posts.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    //check comment
    if (!comment) {
      return res.status(404).json("Comment not found");
    }

    //check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json("User not authorized");
    }

    //get remove index
    const removeIndex = posts.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    posts.comments.splice(removeIndex, 1);

    await posts.save();

    res.json({ msg: "Comment removed" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
