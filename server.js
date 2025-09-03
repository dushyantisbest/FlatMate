import app from "./app.js";
import connectionInstance from "./db.js";
import ErrorHandlingExpress from "./utils/ErrorHandling.js";
import listingRoute from "./routes/listingRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import userRoute from "./routes/userRoute.js";

import InputData from "./init.js";
await connectionInstance();
//run to imput fake data
InputData();

//routes
app.get("/", (req, res) => {
  res.redirect("/listing");
});
app.use("/listing", listingRoute);
app.use("/listing/:id/review", reviewRoute);
app.use("/user", userRoute);

// if the above routes does not match
app.use((req, res, next) => {
  next(new ErrorHandlingExpress(404, "Page not found"));
});
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  res.status(statusCode).render("error.ejs", { statusCode, message });
});

app.listen(process.env.PORT, () => {
  console.log("server is working");
});
