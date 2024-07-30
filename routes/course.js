import express from "express";
import { fetchLectures, getAllCourses, getSingleCourses, fetchLecture } from "../controllers/course.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();
router.get("/course/all", getAllCourses);
router.get("/course/:id", getSingleCourses);
router.get("/lecture/:id", isAuth, fetchLectures);
router.get("/lecture/:id", isAuth, fetchLecture);

export default router;
