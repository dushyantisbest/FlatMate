import joi from "joi";

const listingValidation = joi
  .object({
    title: joi.string().required(),
    price: joi.number().min(0).required(),
    location: joi.string().required(),
    country: joi.string().required(),
    description: joi.string().required(),
    category: joi.string().valid("1BHK", "2BHK", "3BHK", "4BHK", "villa", "studio", "penthouse", "farmhouse", "roommate", "flatmate").optional().allow("", null),
    roomType: joi.string().valid("Single Room", "Shared Room", "Entire Flat", "Private Room").optional().allow("", null),
    genderPreference: joi.string().valid("Any", "Male only", "Female only", "No Preference").optional().allow("", null),
    furnishing: joi.string().valid("Furnished", "Semi-Furnished", "Unfurnished").optional().allow("", null),
    amenities: joi.alternatives().try(joi.array().items(joi.string()), joi.string()).optional(),
    image: joi.any().optional(),
    owner: joi.string().optional(),
    review: joi.array().optional(),
  })
  .unknown(true) // Crucial: Allows additional multipart fields without throwing 400
  .required();

const reviewValidation = joi.object({
  comment: joi.string().required(),
  rating: joi.number().required().min(1).max(5),
});

const aiQueryValidation = joi.object({ 
  message: joi.string().required().min(3).max(500) 
}).required();

export { listingValidation, reviewValidation, aiQueryValidation };
