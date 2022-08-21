const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { errorMiddleware } = require("./middleware/error");
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "config.env" });
  app.use(morgan("dev"));
}

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Origin", req.headers.origin);
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
//   );
//   next();
// });
// Importing routes
const user = require("./routes/user");
const post = require("./routes/post");

//Route
app.use("/api/v1", user);
app.use("/api/v1", post);
// For deployment
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// Global error handling middleware
app.use(errorMiddleware);
module.exports = app;
