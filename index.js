// https://discord.com/api/v9/channels/916740888644964392/messages?limit=50
// mfa.VAG_8y_hBWowNFRPUGLx0YsSSOwNCk3xXwxdIKnKiO-LL1bJNM2riXH1evg4lQlz074WgwaoLh1oGMdhLLhU

import axios from "axios";
import dotenv from "dotenv";
import { Post } from "./model/post.js";
import mongoose from "mongoose";

dotenv.config();

const getMessages = async (channelId) => {
  const res = await axios
    .get(`https://discord.com/api/v9/channels/${channelId}/messages?limit=1`, {
      headers: {
        authorization: process.env.DISCORD_AUTH,
      },
    })
    .catch(() => {
      return 401;
    });
  return res;
};

const createPost = async (new_post) => {
  const post = new Post();
  post.content = new_post.content;
  post.id = new_post.id;
  post.date = new Date();
  await post.save();
  return post;
};
const updatePost = async (post, new_post) => {
  post.content = new_post.content;
  post.id = new_post.id;
  post.date = new Date();
  await post.save();
  return post;
};
const update = async (new_post) => {
  let post = Post.find().sort({ _id: -1 }).limit(1)[0];
  let modified = false;
  if (!post) {
    post = await createPost(new_post);
    console.log("passed", post);
    modified = true;
  } else if (post.id !== new_post.id) {
    console.log("passed here");
    post = await updatePost(post, new_post);
    modified = true;
  }

  return { updated: modified, post: post };
};

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  const channelId = process.env.CHANNEL_ID;
  const res = await getMessages(channelId);
  //console.log(res);
  if (res === 401) {
    console.error("Invalid authorization token");
    // send an email that the code is not working
  } else {
    const message = {
      id: res.data[0].id,
      content: res.data[0].content,
    };
    const post = update(message);
    console.log(message);
    console.log(post.post);
    if (post.modified) {
      console.log("Message updated");
      console.log(post.post);
    }
  }
  //console.log(messages.data[0].content);
};
start();
