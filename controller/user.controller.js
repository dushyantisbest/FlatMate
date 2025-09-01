import User from "../models/user.model.js";

export const renderSignupForm = (req, res) => {
  res.render("user/signup-form.ejs");
};

export const signup = async (req, res) => {
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
};

export const renderLoginForm = (req, res) => {
  res.render("user/login.ejs");
};

export const login = async (req, res) => {
  req.flash("success", "You are logged in !");

  res.redirect(res.locals.redirectUrl);
};

export const logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "logout successful");
    res.redirect("/listing");
  });
};
