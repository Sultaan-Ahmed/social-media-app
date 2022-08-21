const mongoose = require("mongoose");

exports.dbConnect = () => {
  mongoose.connect(process.env.DB_URL, () => {
    console.log(`Database connected successfully.`);
  });
};
