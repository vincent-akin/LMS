import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utils/ApiError.js";

import * as progressRepo from "./progress.repository.js";
import * as lessonRepo from "../lesson/lesson.repository.js";
import * as enrollmentRepo from "../enrollment/enrollment.repository.js";

export const completeLesson = async (
    lessonId,
    studentId
) => {

    const lesson = await lessonRepo.findLessonById(lessonId);

    if (!lesson) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Lesson not found"
        );
    }

    const enrollment = await enrollmentRepo.findEnrollment(
        studentId,
        lesson.courseId
    );

    if (!enrollment) {
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            "You are not enrolled in this course"
        );
    }

    const existing = await progressRepo.findProgress(
        studentId,
        lessonId
    );

    if (existing) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Lesson already completed"
        );
    }

    return progressRepo.completeLesson({
        studentId,
        lessonId
    });
};

export const getCourseProgress = async (
    studentId,
    courseId
    ) => {

    const lessons = await lessonRepo.getLessonsByCourse(courseId);

    const lessonIds = lessons.map(l => l._id);

    const completed = await progressRepo.getCompletedLessons(
        studentId,
        lessonIds
    );

    const progress =
        (completed.length / lessons.length) * 100;

    return {
        totalLessons: lessons.length,
        completedLessons: completed.length,
        progress: Math.round(progress)
    };
};