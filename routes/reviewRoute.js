import express from "express";
import Review from "../models/review.model.js";
import Listing from "../models/listing.model.js";
import asyncWrapper from "../utils/asyncWraper.js";
import { isLoggedIn, validateReview } from "../middleware.js";
import * as reviewController from "../controller/review.controller.js";

const router = express.Router({ mergeParams: true });

// Review post route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  asyncWrapper(reviewController.addReview)
);

// review delete route
router.delete(
  "/:reviewId",
  isLoggedIn,
  asyncWrapper(reviewController.destroyReview)
);

export default router;
