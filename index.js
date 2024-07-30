import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/db.js";
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();

//using middlewares
app.use(express.json());
const port = process.env.PORT;
app.get("/", (req, res) => {
  res.send("server is working");
});
app.use("/uploads", express.static("uploads"));
//using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

app.listen(5000, () => {
  console.log(`server is running on ${port}`);
  connectDB();
});
