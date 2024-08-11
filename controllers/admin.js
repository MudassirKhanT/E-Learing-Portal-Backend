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
  console.log(req.params);
  const course = await Courses.findById(req.params.id);
  console.log("Course,", course);
  if (!course) {
    return res.status(404).json({ message: "No course with this Id" });
  }
  const { title, description } = req.body;
  const file = req.file;
  const lecture = await Lecture.create({
    title,
    description,
    video: file?.path,
    course: course._id,
  });

  return res.status(200).json({ message: "Lecture added", lecture });
});
export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  rm(lecture.video, () => {
    console.log("video deleted");
  });
  await lecture.deleteOne();
  res.json({ message: "Lecture deleted" });
});

const unlikeAsync = promisify(fs.unlink);
export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  const lectures = await Lecture.find({ course: course._id });
  await Promise.all(
    lectures.map(async (lecture) => {
      await unlikeAsync(lecture.video);
      console.log("video deleted");
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

export const getAllUsers = TryCatch(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");

  res.json({ users });
});

export const updateRole = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user.role === "admin") {
    user.role = "user";
    await user.save();

    return res.status(200).json({ message: "Role updated to admin" });
  }
  if (user.role === "user") {
    user.role = "admin";
    await user.save();
    return res.status(200).json({ message: "Role updated " });
  }
});
