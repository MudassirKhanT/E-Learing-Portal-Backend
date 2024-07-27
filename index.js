import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/db.js";
import userRoutes from "./routes/user.js";
dotenv.config();

const app = express();

//using middlewares
app.use(express.json());
const port = process.env.PORT;
app.get("/", (req, res) => {
  res.send("server is working");
});
//using routes
app.use("/api", userRoutes);
app.listen(5000, () => {
  console.log(`server is running on ${port}`);
  connectDB();
});
