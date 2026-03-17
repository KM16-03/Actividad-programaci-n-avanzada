const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");

function differenceInHours(date1, date2) {
  const diff = Math.abs(new Date(date1).getTime() - new Date(date2).getTime());
  return diff / (1000 * 60 * 60);
}

function differenceInDays(date1, date2) {
  const diff = Math.abs(new Date(date1).getTime() - new Date(date2).getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

router.get("/habits", async function (req, res, next) {
  try {
    const habits = await Habit.find();
    res.status(200).json(habits);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener hábitos",
      description: error.toString(),
    });
  }
});

router.post("/habits", async function (req, res, next) {
  try {
    const { title, description } = req.body;

    const habit = new Habit({
      title,
      description,
      days: 0,
      startDate: new Date(),
      lastDone: new Date(),
      lastUpdate: new Date(),
    });

    await habit.save();

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({
      error: "Error al crear hábito",
      description: error.toString(),
    });
  }
});

router.patch("/habits/:id", async function (req, res, next) {
  try {
    const { title, description } = req.body;

    const updatedHabit = await Habit.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );

    res.status(200).json(updatedHabit);
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar hábito",
      description: error.toString(),
    });
  }
});

router.delete("/habits/:id", async function (req, res, next) {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Hábito eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar hábito",
      description: error.toString(),
    });
  }
});

router.patch("/habits/:id/done", async function (req, res, next) {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ error: "Hábito no encontrado" });
    }

    const now = new Date();

    if (!habit.startDate) {
      habit.startDate = now;
    }

    if (!habit.lastUpdate) {
      habit.lastUpdate = now;
    }

    if (!habit.lastDone) {
      habit.lastDone = now;
    }

    const hoursPassed = differenceInHours(now, habit.lastUpdate);

    habit.lastDone = now;

    if (hoursPassed > 24) {
      habit.days = 0;
      habit.startDate = now;
      habit.lastUpdate = now;

      await habit.save();

      return res.status(200).json({
        message: "Habit restarted",
        habit,
      });
    }

    habit.lastUpdate = now;
    habit.days = differenceInDays(now, habit.startDate);

    await habit.save();

    return res.status(200).json({
      message: "Habit marked as done",
      habit,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al marcar hábito",
      description: error.toString(),
    });
  }
});

module.exports = router;