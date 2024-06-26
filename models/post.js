const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  body: { type: String, required: true },
  image: { type: String },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  authorName: { type: String, required: true },
  publishedOn: { type: Date, required: true },
  lastEditedOn: { type: Date, required: true },
  isPublic: { type: Boolean, required: true, default: true },
});

PostSchema.virtual("url").get(() => `/post/${this._id}`);

module.exports = mongoose.model("Post", PostSchema);
