const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Database connected');
    console.log('Base de datos actual:', mongoose.connection.name);
    console.log('Colección de Habit:', mongoose.model('Habit').collection.name);
  })
  .catch((err) => {
    console.log('Error connecting to database:', err.message);
  });

module.exports = mongoose;