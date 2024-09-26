const express = require("express");
const router = express.Router();
const { Show, User } = require("../models/.");

// GET -  one show OR shows of a particular genre (genre in req.query)
router.get("/", async (req, res, next) => {
  try {
    const { genre } = req.query;
    const options = {};
    if (genre) {
      options.genre = genre;
    }
    const allShows = await Show.findAll({ where: options });
    res.json(allShows);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    next(error);
  }
});

// GET - one show
router.get("/:id", async (req, res, next) => {
  try {
    const foundShow = await Show.findByPk(req.params.id);
    if (!foundShow) {
      res.status(404).json({
        error: `Show with ID ${req.params.id} not found`,
      });
    } else {
      res.json(foundShow);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    next(error);
  }
});

// GET -  all users who watched a show
router.get("/:id/users", async (req, res, next) => {
  try {
    const show = await Show.findByPk(req.params.id);
    if (!show) {
      res.status(404).json({
        error: `Show with ID ${req.params.id} not found`,
      });
    } else {
      const showUsers = await show.getUsers();
      res.json(showUsers);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    next(error);
  }
});

// PUT update the {available} property of a show
router.put("/:id/available", async (req, res, next) => {
  try {
    const show = await Show.findByPk(req.params.id);
    if (!show) {
      res.status(404).json({
        error: `Show with ID ${req.params.id} not found`,
      });
    } else {
      show.update({ available: !show.available });
      res.status(204).send();
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    next(error);
  }
});

// DELETE - a show
router.delete("/:id", async (req, res, next) => {
  try {
    const show = await Show.findByPk(req.params.id);
    if (!show) {
      res
        .status(404)
        .json({ error: `Show with ID ${req.params.id} not found` });
    } else {
      await show.destroy();
      res.status(204).send();
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    next(error);
  }
});

module.exports = router;
