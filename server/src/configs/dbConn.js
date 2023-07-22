import mongoose from "mongoose";
import { db } from "./vars.js";

export default async () => {
  try {
    // Connect to mongo with mongoose
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(err);
  }
};
