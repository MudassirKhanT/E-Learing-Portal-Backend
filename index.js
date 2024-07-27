import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/db.js";
dotenv.config();

const app = express();
const port = process.env.PORT;
app.get("/", (req, res) => {
  res.send("server is working");
});
app.listen(5000, () => {
  console.log(`server is running on ${port}`);
  connectDB();
});
