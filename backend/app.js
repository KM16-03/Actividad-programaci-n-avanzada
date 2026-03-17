const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");
const routes = require("./routes");
const Habit = require("./models/Habit");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/", routes);

connectDB();

async function createHabitIfEmpty() {
  try {
    const totalHabits = await Habit.countDocuments();

    if (totalHabits === 0) {
      await Habit.create({
        title: "Tomar agua",
        description: "Tomar 8 vasos de agua"
      });

      console.log("Hábito de prueba creado");
    }
  } catch (error) {
    console.log("Error al crear hábito de prueba:", error.message);
  }
}

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  await createHabitIfEmpty();
});