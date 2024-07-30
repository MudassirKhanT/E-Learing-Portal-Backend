import express from "express";
import { isAdmin, isAuth } from "../middleware/isAuth.js";
import { addLectures, createCourse, deleteCourse, deleteLectures, getAllStats } from "../controllers/admin.js";
import { uploadFiles } from "../middleware/multer.js";

const router = express.Router();
router.post("/course/new", isAuth, isAdmin, uploadFiles, createCourse);
router.post("/course/:id", isAuth, isAdmin, uploadFiles, addLectures);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLectures);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.get("/stats", isAuth, isAdmin, getAllStats);
export default router;
