require("dotenv").config();

const express = require("express");
const { default: mongoose } = require("mongoose");

const app = express();
const authRoutes = require("./routes/auth");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});