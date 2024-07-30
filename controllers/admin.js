import TryCatch from "../middleware/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/lecture.js";
import { rm } from "fs";
import { promisify } from "util";
import fs from "fs";
import { User } from "../models/user.js";
export const createCourse = TryCatch(async (req, res) => {
  const { title, description, category, createdBy, duration, price } = req.body;
  const image = req.file;
  await Courses.create({
    title,
    description,
    category,
    createdBy,
    image: image?.path,
    duration,
    price,
  });
  res.status(201).json({ message: "Course Created Successfully" });
});

export const addLectures = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params);
  if (!course) {
    return res.status(404).json({ message: "No course with this Id" });
  }
  const { title, description } = req.body;
  const file = req.file;
  const lecture = await Lecture.create({
    title,
    description,
    vedio: file?.path,
    course: course._id,
  });

  return res.status(200).json({ message: "Lecture added", lecture });
});
export const deleteLectures = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  rm(lecture.vedio, () => {
    console.log("Vedio deleted");
  });
  await lecture.deleteOne();
  res.json({ message: "Lecture deleted" });
});

const unlikeAsync = promisify(fs.unlink);
export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  const lectures = await Lecture.find({ cousre: course._id });
  await Promise.all(
    lectures.map(async (lecture) => {
      await unlikeAsync(lecture.vedio);
      console.log("Vedio deleted");
    })
  );

  rm(course.image, () => {
    console.log("image deleted");
  });
  await Lecture.find({ cousre: req.params.id }).deleteMany();
  await course.deleteOne();
  await User.updateMany({}, { $pull: { subscription: req.params.id } });
  res.json({ message: "Course deleted" });
});
export const getAllStats = TryCatch(async (req, res) => {
  const totalCourses = (await Courses.find()).length;
  const totalLectures = (await Lecture.find()).length;
  const totalUsers = (await User.find()).length;
  const stats = {
    totalCourses,
    totalLectures,
    totalUsers,
  };
  res.json({ stats });
});
