// https://discord.com/api/v9/channels/916740888644964392/messages?limit=50
// mfa.VAG_8y_hBWowNFRPUGLx0YsSSOwNCk3xXwxdIKnKiO-LL1bJNM2riXH1evg4lQlz074WgwaoLh1oGMdhLLhU

import axios from "axios";
import dotenv from "dotenv";
import { Post } from "./model/post.js"
import mongoose from "mongoose";

dotenv.config();


const getMessages = async (channelId) => {
    const res = await axios.get(`https://discord.com/api/v9/channels/${channelId}/messages?limit=1`, {
        headers: {
          'authorization': process.env.DISCORD_AUTH
        }
    }).catch(() => {
        return 401;
    });
    return res;
}

const pasteText = async (text) => {
    const pastebin = new PastebinAPI({
        'api_dev_key' : process.env.PASTEBIN_KEY,
        'api_user_name' : process.env.PASTEBIN_USERNAME,
        'api_user_password' : process.env.PASTEBIN_PASS
    });
    const res = await pastebin.createPaste(text)
    return res;
}
const createPost = async(content) => {
    const post = new Post();
    post.content = content;
    post.date = new Date();
    await post.save();
    return post;
}
const updatePost = async(post, content) => {
    post.content = content;
    post.date = new Date();
    await post.save();
    return post;
}
const update = async(content) => {
    let post = Post.find().sort({ _id: -1 }).limit(1)[0];
    let modified = false;
    if(!post) {
        post = await createPost(content);
        modified = true;
    }
    if(post.content !== content) {
        updatePost(post, content);
        modified = true;
    }

    return {modified, post};
}

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error(err);
    }

    const channelId = process.env.CHANNEL_ID;
    //const res = await getMessages(channelId);
    //console.log(res);
    const res = 0;
    if(res===401) {
        // send an email that the code is not working
    } else {
        //const post = update(messages.data[0].content);
        // const post = {
        //     id: res.data[0].id,
        //     content: res.data[0].content
        // }
        const post = {
            id: '932515791822274620',
            content: '**Updates for 1/16:**\n' +
              '\n' +
              'Multiple teams across Rome continue building day in and day out in preparation for the v1.0 launch of romedao(.gg) later this month/early next. \n' +
              '\n' +
              "This launch later this month/early Feb will mark the turning point from finance focused DAO to an RPG-centric GameFi ecosystem. As we transition into the regal era we can't wait to start shipping feature after feature that build towards the full game as the center of Rome. \n" +
              '\n' +
              '**Battle contract:** the battle contract will be primed for combat by campaign start. Being able to host multiple simultaneous battles with varying duration, class requirements, houses, and rewards will play at the core of campaigns for many battles to come. \n' +
              '\n' +
              '**Warmap:** the updated warmap and its many landmarks, buildings, toolbar, simplified staking and bonding, etc remain in active development by the gaming team. This will ship alongside battles. \n' +
              '\n' +
              '**Marketplace:** we are in the later stages of a spec for the NFT marketplace that will act as the in-house exchange of all Rome items, weapons, and armor. An existing marketplace team will be helping us repurpose their contracts for Rome. This saves us time from needing to spend existing dev resources on new contracts. \n' +
              '\n' +
              "The marketplace will be in-game and function similarly to the WoW auction house or RS Grand Exchange. All trades in the auction house will be priced in ROME and burn royalties in the protocol's native token. We expect to be ready with this marketplace in mid to late February. \n" +
              '\n' +
              '**Landing page + onboarding:** active work continues on the homepage and Consuls finished a rough draft that they will continue to refine in preparation for the campaign start. \n' +
              '\n' +
              '**Metaverse:** House of Moonsama recently began work on the Romeverse. More details soon. \n' +
              '\n' +
              '**Launchpad:** frontend complete and working with partner projects to start launching our first partner bonds very soon. The Pro bond contracts are deployed and launchpad nearly ready to service partner projects. \n' +
              '\n' +
              'For Rome.'
        };
        
        console.log(post.content);
        if(true) {
            //console.log("proso",JSON.stringify(post));
        }
    }
    //console.log(messages.data[0].content);

}
start();