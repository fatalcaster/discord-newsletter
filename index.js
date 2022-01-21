import dotenv from "dotenv";
import mongoose from "mongoose";
import { app } from "./app.js";
import cron from "node-cron";
import { updateMessage } from "./controllers/update-message.js";

dotenv.config();

const PORT = 3000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
    updateMessage();

    cron.schedule("*/10 * * * *", () => {
      updateMessage();
    });
  } catch (err) {
    console.error(err);
  }
  app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
};
start();
