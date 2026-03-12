import { StatusCodes } from "http-status-codes";
import * as lessonService from "./lesson.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const createLesson = async (req, res, next) => {
    try {
        const lesson = await lessonService.createLesson(
        req.params.courseId,
        req.body,
        req.user
        );

        res
        .status(StatusCodes.CREATED)
        .json(new ApiResponse(StatusCodes.CREATED, "Lesson created", lesson));
    } catch (error) {
        next(error);
    }
};

export const getLessons = async (req, res, next) => {
    try {
        const lessons = await lessonService.getLessons(req.params.courseId);

        res
        .status(StatusCodes.OK)
        .json(new ApiResponse(StatusCodes.OK, "Lessons fetched", lessons));
    } catch (error) {
        next(error);
    }
};

export const updateLesson = async (req, res, next) => {
    try {
        const lesson = await lessonService.updateLesson(
            req.params.id,
            req.body,
            req.user
        );

        res
        .status(StatusCodes.OK)
        .json(
            new ApiResponse(
                StatusCodes.OK,
                "Lesson updated",
                lesson
            )
        );
    } catch (error) {
        next(error);
    }
};

export const deleteLesson = async (req, res, next) => {
    try {
        await lessonService.deleteLesson(
            req.params.id,
            req.user
        );

        res
        .status(StatusCodes.OK)
        .json(
            new ApiResponse(
                StatusCodes.OK,
                "Lesson deleted"
            )
        );
    } catch (error) {
        next(error);
    }
};