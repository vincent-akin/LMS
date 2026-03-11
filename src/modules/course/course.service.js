import { StatusCodes } from "http-status-codes";
import * as courseRepo from "./course.repository.js";
import { ApiError } from "../../utils/apiError.js";
import { User } from "../auth/auth.schema.js";

export const createCourse = async(data, instructorId) => {
    return courseRepo.createCourse({
        ...data,
        instructor: instructorId
    })
};

export const getCourses = async() => {
    return courseRepo.findAllCourses();
};

export const updateCourse = async(courseId, data, instructorId) => {
    const course = await courseRepo.findCourseById(courseId);

    if (!course) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Course not found");
    }

    if (course.instructor.toString() !== User.id && User.role !== "admin") {
        throw new ApiError(StatusCodes.FORBIDDEN, "You are not the owner of this course");
    }

    return courseRepo.updateCourse(courseId, data);
};

export const deleteCourse = async(courseId, instructorId) => {
    const course = await courseRepo.findCourseById(courseId);

    if (!course) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Course not found");
    }

    if (course.instructor.toString() !== User.id && User.role !== "admin") {
        throw new ApiError(StatusCodes.FORBIDDEN, "You are not the owner of this course");
    }

    return courseRepo.deleteCourse(courseId);

};