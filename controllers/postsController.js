const Post = require("../models/post");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.getPosts = async (req, res) => {
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

exports.savePost = async (req, res, next) => {
  try {
    jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
      if (err) return res.status(403).json(err);

      req.authData = authData;

      const user = await User.findById(req.authData._id).exec();

      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
        author: req.authData._id,
        authorName: user.full_name,
        publishedOn: new Date(),
        lastEditedOn: new Date(),
        isPublic: req.body.isPublic !== undefined ? req.body.isPublic : true,
      });

      try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
      } catch (e) {
        res.status(400).json({ message: "Bad Request" });
      }
    });
  } catch (e) {
    console.error("Unexpected error:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Post not found" });
    }

    const post = await Post.findById(req.params.id).exec();
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.editPost = async (req, res, next) => {
  try {
    jwt.verify(req.token, process.env.JWT_SECRET, async (err, authData) => {
      if (err) return res.status(403).json(err);
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ message: "Post not found" });
      }
      const updateFields = {
        title: req.body.title,
        body: req.body.body,
        lastEditedOn: new Date(),
        isPublic: req.body.isPublic,
      };

      try {
        const post = await Post.findOneAndUpdate(
          { _id: req.params.id },
          updateFields,
          { new: true }
        );
        res.status(200).json(post);
      } catch (e) {
        res.status(400).json({ message: "Bad Request", error: e.message }); // Include the error message for debugging
      }
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
