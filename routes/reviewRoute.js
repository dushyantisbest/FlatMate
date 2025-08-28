import express from "express";
import Review from "../models/review.model.js";
import Listing from "../models/listing.model.js";
import asyncWrapper from "../utils/asyncWraper.js";
import { isLoggedIn, validateReview } from "../middleware.js";

const router = express.Router({ mergeParams: true });

// Review post route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  asyncWrapper(async (req, res) => {
    const listing = await Listing.findOne({ _id: req.params.id });

    const reviewData = { ...req.body, createdBy: req.user.id };

    const myReview = await Review.create(reviewData);

    listing.reviews.push(myReview);
    await listing.save();
    req.flash("success", "Review added");
    res.redirect(`/listing/${listing.id}`);
  })
);

// review delete route
router.delete(
  "/:reviewId",
  isLoggedIn,
  asyncWrapper(async (req, res) => {
    await Listing.findByIdAndUpdate(req.params.id, {
      $pull: { reviews: req.params.reviewId },
    });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listing/${req.params.id}`);
  })
);

export default router;
