import mongoose from "mongoose";

let connectionInstance;

try {
  connectionInstance = async () =>
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
  console.log("database connection succesful");
} catch (error) {
  console.log("Database connection failed");
}

export default connectionInstance;
