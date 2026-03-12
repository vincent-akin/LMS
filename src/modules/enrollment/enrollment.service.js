import { StatusCodes } from "http-status-codes";
import { ApiError } from "../../utils/ApiError.js";

import * as enrollmentRepo from "./enrollment.repository.js";
import * as courseRepo from "../course/course.repository.js";

export const enrollStudent = async (courseId, studentId) => {

    const course = await courseRepo.findCourseById(courseId);

    if (!course) {
        throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Course not found"
        );
    }

    const existing = await enrollmentRepo.findEnrollment(
        studentId,
        courseId
    );

    if (existing) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Already enrolled"
        );
    }

    return enrollmentRepo.createEnrollment({
        studentId,
        courseId
    });
};

export const getStudentCourses = async (studentId) => {
    return enrollmentRepo.getStudentCourses(studentId);
};