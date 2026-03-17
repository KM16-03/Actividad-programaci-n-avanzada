const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");

router.get("/habits", async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener hábitos",
      error: error.message,
    });
  }
});

router.post("/habits", async (req, res) => {
  try {
    const { title, description } = req.body;

    const newHabit = new Habit({
      title,
      description,
    });

    await newHabit.save();

    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear hábito",
      error: error.message,
    });
  }
});

router.patch("/habits/:id", async (req, res) => {
  try {
    const { title, description } = req.body;

    const updatedHabit = await Habit.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );

    res.json(updatedHabit);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar hábito",
      error: error.message,
    });
  }
});

router.delete("/habits/:id", async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: "Hábito eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar hábito",
      error: error.message,
    });
  }
});

module.exports = router;