import { Progress } from "./progress.schema.js";

export const completeLesson = (data) => {
    return Progress.create(data);
};

export const findProgress = (studentId, lessonId) => {
    return Progress.findOne({ studentId, lessonId });
};

export const getCompletedLessons = (studentId, courseLessons) => {
    return Progress.find({
        studentId,
        lessonId: { $in: courseLessons }
    });
};