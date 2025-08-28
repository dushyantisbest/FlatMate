import mongoose, { Schema } from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// make a delete middleware here

const Review = mongoose.model("Review", reviewSchema);

export default Review;
