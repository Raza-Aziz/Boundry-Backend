import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to MongoDB");
  } catch (e) {
    console.error("Couldn't connect to MongoDB ::", e.message);
    process.exit(1);
  }
};

export default connectDb;
