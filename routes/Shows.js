const express = require("express");
const router = express.Router();
const { Show } = require("../models/.");
const { body, matchedData, validationResult } = require("express-validator");

// GET -  all shows OR shows of a particular genre (genre in req.query)
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

// BONUS - Server Side Validation

// POST - title of a show must be a max of 25 characters
router.post(
  "/",
  [
    body("title")
      .trim()
      .notEmpty()
      .isLength({ max: 25 })
      .withMessage("Title can only have a maximum of 25 characters"),
    body("genre").isString(),
    body("available").isBoolean(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        const data = matchedData(req);
        const newShow = await Show.create({
          title: data.title,
          genre: data.genre,
          available: data.available,
        });

        res
          .status(201)
          .json({ message: "New show created successfully", data: newShow });
      }
    } catch (error) {
      console.error(`Error : ${error.message}`);
      next(error);
    }
  }
);

module.exports = router;
