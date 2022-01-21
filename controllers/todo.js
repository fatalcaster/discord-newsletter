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
  const post = update(message);
  // console.log(message);
  // console.log(post.post);
  if (post.modified) {
    console.log("Message updated\n");
  }
}
