const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/", require("./routes/index"));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});