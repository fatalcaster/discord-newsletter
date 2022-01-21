import { Post } from "./../model/post.js";

const createPost = async (new_post) => {
  const post = new Post();
  post.content = new_post.content;
  post.id = new_post.id;
  post.date = new Date();
  await post.save();
  return post;
};
const updatePost = async (post, new_post) => {
  if (!post) {
    throw new Error("Internal Server Error");
  }
  post.content = new_post.content;
  post.id = new_post.id;
  post.date = new Date();
  await post.save();
  return post;
};

const getLatestPost = async () => {
  const post = (await Post.find({}).sort({ _id: -1 }).limit(1))[0];
  return post;
};

const getLatestPostSubscribers = async () => {
  const post = await getLatestPost();
  if (!post) {
    return [];
  } else {
    return post.subscribers;
  }
};

export { createPost, updatePost, getLatestPost, getLatestPostSubscribers };
