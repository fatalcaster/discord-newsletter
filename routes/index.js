import { Router } from "express";
import { validateEmail } from "../helpers/email-validation.js";
import { Post } from "./../model/post.js";
const router = Router();

router.get("/", function (req, res) {
  res.render("index");
});

router.post("/", async function (req, res) {
  // console.log(req.body);

  const email = req.body.email;

  if (!validateEmail(email)) {
    res.statusCode = 400;
    res.redirect("/");
  }
  const post = (await Post.find({}).sort({ _id: -1 }).limit(1))[0];
  if (!post) {
    res.statusCode = 500;
    res.render("subscribed", {
      text: "We're having some dificulties find that post",
    });
    return;
  }
  if (post.subscribers.includes(email)) {
    res.statusCode = 400;
    res.render("subscribed", { text: "Already subscribed!" });
    return;
  }
  post.subscribers.push(email);
  await post.save();
  res.render("subscribed", { text: "Successfully subscibed!" });
});

export { router as IndexRouter };
