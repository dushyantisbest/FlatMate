import mongoose, { Schema } from "mongoose";
import Review from "./review.model.js";

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: {
      url: { type: String, required: true, default: "https://via.placeholder.com/600x400" },
      filename: { type: String, default: "default" },
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
      type: String, 
      enum: ["1BHK", "2BHK", "3BHK", "4BHK", "villa", "studio", "penthouse", "farmhouse", "roommate", "flatmate"],
      default: "1BHK"
    },
    roomType: {
      type: String,
      enum: ["Single Room", "Shared Room", "Entire Flat", "Private Room"],
      default: "Single Room"
    },
    genderPreference: {
      type: String,
      enum: ["Any", "Male only", "Female only", "No Preference"],
      default: "Any"
    },
    furnishing: {
      type: String,
      enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
      default: "Furnished"
    },
    amenities: [{ type: String }],
    geometry: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

listingSchema.index({ geometry: "2dsphere" });

listingSchema.post("findOneAndDelete", async function (myListing) {
  if (myListing.reviews) {
    await Review.deleteMany({ _id: { $in: myListing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
