import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
  },
  { timestamp: true }
);

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

export default User;
