import express from "express";
import { isLoggedIn } from "../middleware.js";
import { renderChatbot, queryListings } from "../controller/ai.controller.js";
import { aiQueryValidation } from "../schemaValidation.js";
import ErrorHandlingExpress from "../utils/ErrorHandling.js";

const router = express.Router();

const validateAiQuery = (req, res, next) => {
  const { error } = aiQueryValidation.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ErrorHandlingExpress(400, errMsg);
  }
  next();
};

router.get("/", renderChatbot);
router.post("/query", validateAiQuery, queryListings);

export default router;
