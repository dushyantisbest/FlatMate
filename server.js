import "dotenv/config";
import app from "./app.js";
import connectionInstance from "./db.js";
import ErrorHandlingExpress from "./utils/ErrorHandling.js";
import listingRoute from "./routes/listingRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import aiRoute from "./routes/aiRoute.js";
import { createServer } from "http";
import { initSocket } from "./utils/socket.js";

const server = createServer(app);
initSocket(server);

// Routes
app.get("/", (req, res) => {
  res.redirect("/listing");
});
app.use("/listing", listingRoute);
app.use("/listing/:id/review", reviewRoute);
app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/ai", aiRoute);

// 404 Handler
app.use((req, res, next) => {
  next(new ErrorHandlingExpress(404, "Page not found"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  res.status(statusCode).render("error.ejs", { statusCode, message });
});

const PORT = process.env.PORT || 8008;

// Connect to MongoDB & start listening
connectionInstance()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Initial MongoDB connection failed:", err.message);
    // Still listen so errors can be inspected and retried
    server.listen(PORT, () => {
      console.log(`Server started in fallback mode on http://localhost:${PORT}`);
    });
  });
