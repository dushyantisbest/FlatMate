import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import methodOverride from "method-override";
import engine from "ejs-mate";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import localStrategy from "passport-local";
import User from "./models/user.model.js";

//get the dirname variable
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const sessionOptions = {
  secret: "mysupersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // make it true in production right now on localhost it should be set false
    maxAge: 7 * 24 * 60 * 60 * 1000, // maximum age of the cookie , auto renew each requrest
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
};
//code for setting path

// all the middle wares
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

export default app;
