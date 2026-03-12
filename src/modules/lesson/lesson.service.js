import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utils/ApiError.js";

import * as lessonRepo from "./lesson.repository.js";
import * as courseRepo from "../course/course.repository.js";

export const createLesson = async (courseId, data, user) => {
    const course = await courseRepo.findCourseById(courseId);

    if (!course) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Course not found");
    }

    if (
        course.instructorId.toString() !== user.id &&
        user.role !== "admin"
    ) {
        throw new ApiError(StatusCodes.FORBIDDEN, "Not allowed");
    }

    return lessonRepo.createLesson({
        ...data,
        courseId
    });
};

export const getLessons = async (courseId) => {
    return lessonRepo.getLessonsByCourse(courseId);
};

export const updateLesson = async (lessonId, data, user) => {
    const lesson = await lessonRepo.findLessonById(lessonId);

    if (!lesson) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Lesson not found");
    }

    const course = await courseRepo.findCourseById(lesson.courseId);

    if (
        course.instructorId.toString() !== user.id &&
        user.role !== "admin"
    ) {
        throw new ApiError(StatusCodes.FORBIDDEN, "Not allowed");
    }

    return lessonRepo.updateLesson(lessonId, data);
};

export const deleteLesson = async (lessonId, user) => {
    const lesson = await lessonRepo.findLessonById(lessonId);

    if (!lesson) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Lesson not found");
    }

    const course = await courseRepo.findCourseById(lesson.courseId);

    if (
        course.instructorId.toString() !== user.id &&
        user.role !== "admin"
    ) {
        throw new ApiError(StatusCodes.FORBIDDEN, "Not allowed");
    }

    return lessonRepo.deleteLesson(lessonId);
};