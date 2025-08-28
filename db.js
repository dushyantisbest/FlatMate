import mongoose from "mongoose";

const URL = "mongodb://localhost:27017/hotels";
let connectionInstance;

try {
  connectionInstance = async () => await mongoose.connect(URL);
  console.log("database connection succesful");
} catch (error) {
  console.log("Database connection failed");
}

export default connectionInstance;
