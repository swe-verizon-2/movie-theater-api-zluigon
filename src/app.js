const express = require("express");
const app = express();

const userRouter = require("../routes/Users");
const showRouter = require("../routes/Shows");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("/shows", showRouter);

module.exports = app;
