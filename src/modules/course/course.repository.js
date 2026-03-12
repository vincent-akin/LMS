import { Course } from "./course.model.js";

export const createCourse = (data) => {
    return Course.create(data);
};

export const findAllCourses = ({ page, limit, search }) => {

    const query = {};

    if (search) {
        query.title = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    return Course.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
};

export const findCourseById = (id) => {
    return Course.findById(id);
};

export const updateCourse = (id, data) => {
    return Course.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCourse = (id) => {
    return Course.findByIdAndDelete(id);
};

