import express from "express";
import asyncWrapper from "../utils/asyncWraper.js";
import passport from "passport";
import { saveRedirectUrlLocal } from "../middleware.js";
import * as userController from "../controller/user.controller.js";

const router = express.Router();

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(asyncWrapper(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrlLocal,
    passport.authenticate("local", {
      failureRedirect: "/user/login",
      failureFlash: true,
    }),
    asyncWrapper(userController.login)
  );

router.post("/logout", asyncWrapper(userController.logout));

export default router;
