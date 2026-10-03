import express from "express";
import asyncWrapper from "../utils/asyncWraper.js";
import * as listingController from "../controller/listing.controller.js";
import { isLoggedIn, isOwner, saveRedirectUrlSession, validateListing } from "../middleware.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router({ mergeParams: true });

router.get("/", saveRedirectUrlSession, asyncWrapper(listingController.homePage));
router.route("/add")
  .get(saveRedirectUrlSession, isLoggedIn, listingController.listingForm)
  .post(isLoggedIn, upload.single('image'), validateListing, asyncWrapper(listingController.addListing));
router.get("/:id", saveRedirectUrlSession, asyncWrapper(listingController.showIndivisualListing));
router.route("/edit/:id")
  .get(saveRedirectUrlSession, isLoggedIn, asyncWrapper(listingController.editListingForm))
  .put(isLoggedIn, isOwner, upload.single('image'), validateListing, asyncWrapper(listingController.UpdateListing));
router.delete("/delete/:id", isLoggedIn, isOwner, asyncWrapper(listingController.destroyListing));

export default router;
