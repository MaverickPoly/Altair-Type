import mongoose from "mongoose";

export const connectDB = async (DATABASE_URI) => {
  try {
    const res = await mongoose.connect(DATABASE_URI);
    console.log(`Connected to db: ${res.connection.host}`);
  } catch (e) {
    console.error(`Error connecting db: ${e}`);
    process.exit(1);
  }
};
