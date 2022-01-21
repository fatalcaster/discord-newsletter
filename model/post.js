import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PostSchema = new Schema({
  content: { type: String },
  date: { type: Date },
  id: { type: String, unique: true },
  subscribers: { type: Array, default: [], required: true },
  sent: { type: Boolean, default: false, required: true },
});

const Post = mongoose.model("Post", PostSchema);

export { Post };
