import express from "express";

import {
    completeLesson,
    courseProgress
} from "./progress.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    "/complete/:lessonId",
    authenticate,
    completeLesson
);

router.get(
    "/course/:courseId",
    authenticate,
    courseProgress
);

export default router;