import dotenv from "dotenv";
import axios from "axios";
import { sendEmail } from "./send-email.js";
import {
  createPost,
  updatePost,
  getLatestPost,
  getLatestPostSubscribers,
} from "./../services/post-service.js";

dotenv.config();

const getLatestMessage = async (channelId) => {
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

const update = async (new_post) => {
  let post = await getLatestPost();
  let modified = false;
  if (!post) {
    post = await createPost(new_post);
    console.log("Creating New Post");
    modified = true;
  } else if (post.id !== new_post.id) {
    console.log("Updating Existing Post");
    post = await updatePost(post, new_post);
    modified = true;
  }

  return { updated: modified, post: post };
};

const updateMessage = async () => {
  console.log("Checking for updates...");
  const channelId = process.env.CHANNEL_ID;
  const res = await getLatestMessage(channelId);
  //console.log(res);
  if (res === 401) {
    console.error("Invalid authorization token");
    // send an email that the code is not working
  } else {
    const message = {
      id: res.data[0].id,
      content: res.data[0].content,
    };
    const post = await update(message);
    // console.log(message);
    // console.log(post.post);
    if (post.updated || !post.post.sent) {
      console.log("\nMessage updated\n");
      // console.log(post.post);
      const post_to_send = post.post.content.split("\n");
      const subject = post_to_send[0];

      post_to_send.shift();

      const body = post_to_send.join("\n");
      const send_to = await getLatestPostSubscribers();
      if (send_to.length == 0) return;
      try {
        await sendEmail(send_to, subject, body);
        console.log("Message sent");
        post.post.sent = true;
        await post.post.save();
      } catch (err) {
        console.log("Message didn't go through", err);
      }
    }
  }
};

export { updateMessage };
