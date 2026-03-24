var express = require('express');
var router = express.Router();
const Habit = require('../models/Habit');
const jwt = require('jsonwebtoken');

/* middleware para validar token */
const authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const tokenWithoutBearer = authHeader.replace('Bearer ', '');
    const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/habits', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const habits = await Habit.find({ userId });

    res.json(habits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving habits' });
  }
});

router.post('/habits', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userId;

    const habit = new Habit({
      title,
      description,
      userId
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error creating habit' });
  }
});

router.delete('/habits/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const deletedHabit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId
    });

    if (!deletedHabit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json({ message: 'Habit deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Habit not found' });
  }
});

router.patch('/habits/markasdone/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const habit = await Habit.findOne({
      _id: req.params.id,
      userId
    });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const now = new Date();
    const hoursDifference = timeDifferenceInHours(now, habit.lastUpdate);

    habit.lastDone = now;

    if (hoursDifference < 24) {
      habit.days = timeDifferenceInDays(now, habit.startedAt);
      habit.lastUpdate = now;
      await habit.save();
      return res.status(200).json({ message: 'Habit marked as done' });
    } else {
      habit.days = 0;
      habit.lastUpdate = now;
      habit.startedAt = now;
      await habit.save();
      return res.status(200).json({ message: 'Habit restarted' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Habit not found' });
  }
});

const timeDifferenceInHours = (date1, date2) => {
  const differenceMs = Math.abs(date1 - date2);
  return differenceMs / (1000 * 60 * 60);
};

const timeDifferenceInDays = (date1, date2) => {
  const differenceMs = Math.abs(date1 - date2);
  return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
};

module.exports = router;