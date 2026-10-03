import Listing from "../models/listing.model.js";
import { geocodeAddress } from "../utils/geocoding.js";
import ErrorHandlingExpress from "../utils/ErrorHandling.js";

export const homePage = async (req, res) => {
  const { category, search } = req.query;
  const filter = {};
  if (category && category !== "all") {
    filter.category = category;
  }
  if (search && search.trim()) {
    filter.$or = [
      { title: { $regex: search.trim(), $options: "i" } },
      { location: { $regex: search.trim(), $options: "i" } },
      { country: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } },
    ];
  }
  const list = await Listing.find(filter).sort({ createdAt: -1 });
  res.render("landing.ejs", { list, selectedCategory: category || "all", search: search || "" });
};

export const listingForm = (req, res) => {
  res.render("listings/add_listing_form.ejs");
};

export const addListing = async (req, res) => {
  const geometry = await geocodeAddress(`${req.body.location}, ${req.body.country}`);
  
  const listingData = {
    ...req.body,
    owner: req.user.id,
    geometry,
    image: {
      url: req.file?.path || "https://via.placeholder.com/600x400",
      filename: req.file?.filename || "default",
    },
  };
  await Listing.create(listingData);
  req.flash("success", "New Listing added ");
  res.redirect("/listing");
};

export const showIndivisualListing = async (req, res) => {
  const { id } = req.params;
  const hotelData = await Listing.findById(id)
    .populate({ path: "reviews", model: "Review", populate: { path: "createdBy", model: "User" } })
    .populate("owner");
  if (!hotelData) {
    req.flash("error", "Listing not found");
    res.redirect("/listing");
  } else {
    res.render("listings/indivisual_description.ejs", { hotelData });
  }
};

export const editListingForm = async (req, res) => {
  const { id } = req.params;
  let hotelData = await Listing.findById(id);
  res.render("listings/edit_listing_form.ejs", { hotelData });
};

export const UpdateListing = async (req, res) => {
  if (!req.body) {
    throw new ErrorHandlingExpress(400, "Enter valid data");
  }
  const { id } = req.params;
  
  const updateData = { ...req.body };
  updateData.geometry = await geocodeAddress(`${req.body.location}, ${req.body.country}`);
  
  const listing = await Listing.findByIdAndUpdate(id, updateData, { runValidators: true });
  
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
    await listing.save();
  }
  
  req.flash("success", "Listing updated ");
  res.redirect(`/listing/${id}`);
};

export const destroyListing = async (req, res) => {
  let id = req.params.id;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listing");
};
