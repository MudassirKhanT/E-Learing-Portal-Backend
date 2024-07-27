import mongoose from "mongoose";

export const connectDB = async () => {
  const url = process.env.DB_URL;
  console.log(url);
  try {
    await mongoose.connect(url);
    console.log("Database Connected");
  } catch (err) {
    console.log(err);
  }
};

// export const connectDB = async () => {
//   const DbUrl = process.env.DB_URL;
//   await mongoose.connect(DbUrl);
//   const db = mongoose.connection;
//   db.on("error", console.error.bind(console, "Connection Error:"));
//   db.once("open", () => {
//     console.log("DB Connected...");
//   });
// };
