import joi from "joi";

const listingValidation = joi
  .object({
    title: joi.string().required(),
    image: joi.string().allow("", null),
    price: joi.number().min(0).required(),
    location: joi.string().required(),
    country: joi.string().required(),
    description: joi.string().required(),
    owner: joi.string(),
    review: joi.array(),
  })
  .required();

const reviewValidation = joi.object({
  comment: joi.string().required(),
  rating: joi.number().required().min(1).max(5),
});

export { listingValidation, reviewValidation };
