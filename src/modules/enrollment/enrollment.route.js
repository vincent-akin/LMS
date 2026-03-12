import express from "express";

import {
    enrollCourse,
    myCourses
} from "./enrollment.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    "/:courseId",
    authenticate,
    enrollCourse
);

router.get(
    "/my-courses",
    authenticate,
    myCourses
);

export default router;