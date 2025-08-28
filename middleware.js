import Listing from "./models/listing.model.js";
import asyncWrapper from "./utils/asyncWraper.js";
import { listingValidation, reviewValidation } from "./schemaValidation.js";
import ErrorHandlingExpress from "./utils/ErrorHandling.js";
import Review from "./models/review.model.js";

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You are not logged in");
    return res.redirect("/user/login");
  }
  next();
};

const saveRedirectUrlSession = (req, res, next) => {
  req.session.redirectUrl = req.originalUrl;
  next();
};

const saveRedirectUrlLocal = (req, res, next) => {
  if (!req.session.redirectUrl) {
    req.session.redirectUrl = "/listing";
  }
  res.locals.redirectUrl = req.session.redirectUrl;

  next();
};

const validateListing = (req, res, next) => {
  if (listingValidation.validate(req.body).error) {
    throw new ErrorHandlingExpress(
      400,
      listingValidation.validate(req.body).error
    );
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  if (reviewValidation.validate(req.body).error) {
    throw new ErrorHandlingExpress(
      400,
      reviewValidation.validate(req.body).error
    );
  } else {
    next();
  }
};

const isOwner = asyncWrapper(async (req, res, next) => {
  const listingOwner = await Listing.findById(req.params.id).populate("owner");

  if (req.user && req.user.id === listingOwner.owner.id) {
    return next();
  } else {
    req.flash("error", "You are not the owner of this property");

    const redirectUrl = `/listing/${req.params.id}`;
    res.redirect(redirectUrl);
  }
});

const isCreatedBy = asyncWrapper(async (req, res, next) => {
  const reveiewCreatedById = await Review.findById(req.params.reviewId)
    .createdBy.id;
  if (req.user && req.user.id === reveiewCreatedById) {
    return next();
  } else {
    req.flash("error", "You are did not create this review");

    const redirectUrl = req.session.redirectUrl || "/listing";
    res.redirect(redirectUrl);
  }
});

export {
  isLoggedIn,
  saveRedirectUrlLocal,
  saveRedirectUrlSession,
  validateListing,
  validateReview,
  isOwner,
};
