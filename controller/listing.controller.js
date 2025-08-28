// import { express } from "express";
import Listing from "../models/listing.model.js";

export const homePage = async (req, res) => {
  const list = await Listing.find({});
  res.render("landing.ejs", { list });
};

export const listingForm = (req, res) => {
  res.render("add_listing_form.ejs");
};

export const addListing = async (req, res) => {
  const listingData = { ...req.body, owner: req.user.id };
  await Listing.insertOne(listingData);
  req.flash("success", "New Listing added ");
  res.redirect("/listing");
};

export const showIndivisualListing = async (req, res) => {
  const { id } = req.params;
  const hotelData = await Listing.findById(id)
    .populate({
      path: "reviews",
      model: "Review",
      populate: {
        path: "createdBy",
        model: "User",
      },
    })
    .populate("owner");
  if (!hotelData) {
    req.flash("error", "Listing not found");
    res.redirect("/listing");
  } else {
    res.render("indivisual_description.ejs", { hotelData });
  }
};

export const editListingForm = async (req, res) => {
  const { id } = req.params;
  let hotelData = await Listing.findById(id);
  res.render("edit_listing_form.ejs", { hotelData });
};

export const UpdateListing = async (req, res) => {
  if (!req.body) {
    throw new ErrorHandlingExpress(400, "Enter valid data");
  }
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body, { runValidators: true });
  req.flash("success", "Listing updated ");
  res.redirect(`/listing/${id}`);
};

export const destroyListing = async (req, res) => {
  let id = req.params.id;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listing");
};
