const Post = require("../models/post");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.get_posts = async (req, res) => {
  try {
    const allPosts = await Post.find().exec();
    if (allPosts.length === 0) {
      throw new Error("Posts not found");
    }
    res.send(allPosts);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};

exports.save_post = async (req, res, next) => {
  try {
    jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
      if (err) return res.status(403).json(err);

      req.authData = authData;

      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
        author: req.authData._id,
        publishedOn: new Date(),
        lastEditedOn: new Date(),
        isPublic: req.body.isPublic !== undefined ? req.body.isPublic : true,
      });

      try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
      } catch (e) {
        console.error("Error saving post:", e);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  } catch (e) {
    console.error("Unexpected error:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
