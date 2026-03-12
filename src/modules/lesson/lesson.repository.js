import { Lesson } from "./lesson.schema.js";

export const createLesson = (data) => {
    return Lesson.create(data);
};

export const getLessonsByCourse = (courseId) => {
    return Lesson.find({ courseId }).sort({ order: 1 });
};

export const findLessonById = (id) => {
    return Lesson.findById(id);
};

export const updateLesson = (id, data) => {
    return Lesson.findByIdAndUpdate(id, data, { new: true });
};

export const deleteLesson = (id) => {
    return Lesson.findByIdAndDelete(id);
};