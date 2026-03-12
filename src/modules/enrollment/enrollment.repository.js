import { Enrollment } from "./enrollment.schema.js";

export const createEnrollment = (data) => {
    return Enrollment.create(data);
};

export const findEnrollment = (studentId, courseId) => {
    return Enrollment.findOne({ studentId, courseId });
};

export const getStudentCourses = (studentId) => {
    return Enrollment.find({ studentId })
    .populate("courseId");
};

export const getCourseStudents = (courseId) => {
    return Enrollment.find({ courseId })
    .populate("studentId");
};