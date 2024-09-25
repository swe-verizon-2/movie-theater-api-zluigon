const express = require("express");
const route = express.Router();
const { User, Show } = require("../models/.");

route.get("/", async (req, res, next) => {
  try {
    const allUsers = await User.findAll();
    res.json(allUsers);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    next(error);
  }
});

route.get("/:id", async (req, res, next) => {
  try {
    const foundUser = await User.findByPk();
    if (!foundUser) {
      throw new Error("User does not exist");
    } else {
      res.json(foundUser);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    next(error);
  }
});

route.get("/:id/shows", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    const userShows = await user.getShows();
    res.json(userShows);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    next(error);
  }
});

route.put("/:id/shows/:showId", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    const show = await Show.findByPk(req.params.showId);
    if (!user || !show) {
      res.sendStatus(404);
    } else {
      await user.addShow(show);
      res.sendStatus(200);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    next(error);
  }
});

module.exports = route;
