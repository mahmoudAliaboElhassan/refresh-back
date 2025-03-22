require("dotenv").config();
// .env file should be in root directory with node modules
const express = require("express");

const app = express();

const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const url = process.env.MONGO_URL;

mongoose
  .connect(url)
  .then(() => {
    console.log("connected Successfully ");
  })
  .catch((err) => {
    console.log(err);
  });

var cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const teacherRouter = require("./routes/teacher.route");

app.use(express.json());
app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api/teachers", teacherRouter);

app.listen(5000, () => {
  console.log("server established");
});
