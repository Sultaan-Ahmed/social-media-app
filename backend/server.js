const app = require("./app");
const port = process.env.PORT || 5000;
const cloudinary = require("cloudinary");
const { dbConnect } = require("./config/db");

// Handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to uncaught exception.`);
  process.exit(1);
});

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

dbConnect();
const server = app.listen(port, () => {
  console.log(`App running on port http://localhost:${port}`);
});

// Unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down due to unhandled promise rejection.`);
  server.close(() => {
    process.exit(1);
  });
});
