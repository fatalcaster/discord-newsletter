import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PostSchema = new Schema({
  content: String,
  date: Date,
  id: String,
});

const Post = mongoose.model("Post", PostSchema);

export { Post };
