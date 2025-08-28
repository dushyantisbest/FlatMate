import express from "express";
// import User from "../models/user.model.js";
import asyncWrapper from "../utils/asyncWraper.js";
import User from "../models/user.model.js";
import passport from "passport";
import { saveRedirectUrlLocal } from "../middleware.js";

const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("user/signup-form.ejs");
});

router.post(
  "/signup",
  asyncWrapper(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = await User.register(new User({ username, email }), password);
      // show a flash message

      req.login(user, function (err) {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to flatMate");
        res.redirect("/listing");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/user/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrlLocal,
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  asyncWrapper(async (req, res) => {
    req.flash("success", "You are logged in !");

    res.redirect(res.locals.redirectUrl);
  })
);

router.post("/logout", async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "logout successful");
    res.redirect("/listing");
  });
});

export default router;
