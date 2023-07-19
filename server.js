const express = require("express");
const errorHandler = require("./ middleware/errorHandler");
const dotenv = require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(errorHandler);

const dbConfig = require("./config/dbConnection");
const mongoose = require("mongoose");
mongoose.promise = global.promise;

mongoose
  .connect(dbConfig.URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
