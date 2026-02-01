import mongoose, { Schema } from "mongoose";
import Review from "./review.model.js";

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: {
      url: {
        type: String,
        required: true,
        default: "https://via.placeholder.com/600x400",
      },
      filename: {
        type: String,
        default: "default",
      },
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

// mongoose middleware to remove all the reviews when the listing is deleted

listingSchema.post("findOneAndDelete", async function (myListing) {
  if (myListing.reviews) {
    await Review.deleteMany({
      _id: { $in: myListing.reviews },
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
