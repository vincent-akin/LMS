import express from "express";

import {
    createLesson,
    getLessons,
    updateLesson,
    deleteLesson
} from "./lesson.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/course/:courseId", getLessons);

router.post(
    "/course/:courseId",
    authenticate,
    authorize("instructor", "admin"),
    createLesson
);

router.patch(
    "/:id",
    authenticate,
    authorize("instructor", "admin"),
    updateLesson
);

router.delete(
    "/:id",
    authenticate,
    authorize("instructor", "admin"),
    deleteLesson
);

export default router;