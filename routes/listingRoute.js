import express from "express";
import asyncWrapper from "../utils/asyncWraper.js";
import Listing from "../models/listing.model.js";
import * as listingController from "../controller/listing.controller.js";
import {
  isLoggedIn,
  isOwner,
  saveRedirectUrlSession,
  validateListing,
} from "../middleware.js";

const router = express.Router({ mergeParams: true });

//read
router.get(
  "/",
  saveRedirectUrlSession,
  asyncWrapper(listingController.homePage)
);

//create
router.get(
  "/add",
  saveRedirectUrlSession,
  isLoggedIn,
  listingController.listingForm
);

router.post(
  "/add",
  isLoggedIn,
  validateListing,
  asyncWrapper(listingController.addListing)
);

// to display indivisul hotel data
router.get(
  "/:id",
  saveRedirectUrlSession,
  asyncWrapper(listingController.showIndivisualListing)
);

//edit
router.get(
  "/edit/:id",
  saveRedirectUrlSession,
  isLoggedIn,
  asyncWrapper(listingController.editListingForm)
);

//update
router.put(
  "/edit/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  asyncWrapper(listingController.UpdateListing)
);

//delete
router.delete(
  "/delete/:id",
  isLoggedIn,
  isOwner,
  asyncWrapper(listingController.destroyListing)
);

export default router;
