import mongoose from "mongoose";

const schema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Courses",
    required: true,
  },
  cretedAt: {
    type: Date,
    default: Date.now,
  },
});
export const Lecture = mongoose.model("Lecture", schema);
