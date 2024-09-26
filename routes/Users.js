const express = require("express");
const router = express.Router();
const { User, Show } = require("../models/.");

// GET - all users
router.get("/", async (req, res, next) => {
  try {
    const allUsers = await User.findAll();
    res.json(allUsers);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    next(error);
  }
});

// GET - one user
router.get("/:id", async (req, res, next) => {
  try {
    const foundUser = await User.findByPk();
    if (!foundUser) {
      res.status(404).json({
        error: `User with ID ${req.params.id} not found`,
      });
    } else {
      res.json(foundUser);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    next(error);
  }
});

// GET - all shows watched by a user (user id in req.params)
router.get("/:id/shows", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404).json({
        error: `User with ID ${req.params.id} not found`,
      });
    } else {
      const userShows = await user.getShows();
      res.json(userShows);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    next(error);
  }
});

// PUT - associate a user with a show they have watched
router.put("/:id/shows/:showId", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    const show = await Show.findByPk(req.params.showId);
    if (!user || !show) {
      res.status(404).json({
        error: `User with ID ${req.params.id} or Show with ID ${req.params.showId} not found`,
      });
    } else {
      await user.addShow(show);
      res.status(204).send();
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    next(error);
  }
});

module.exports = router;
