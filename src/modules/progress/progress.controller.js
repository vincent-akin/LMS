import { StatusCodes } from "http-status-codes";
import * as progressService from "./progress.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const completeLesson = async (req, res, next) => {
    try {

        const result =
        await progressService.completeLesson(
            req.params.lessonId,
            req.user.id
        );

        res
        .status(StatusCodes.CREATED)
        .json(
            new ApiResponse(
            StatusCodes.CREATED,
            "Lesson completed",
            result
            )
        );

    } catch (error) {
        next(error);
    }
};

export const courseProgress = async (req, res, next) => {
    try {

        const progress =
        await progressService.getCourseProgress(
            req.user.id,
            req.params.courseId
        );

        res
        .status(StatusCodes.OK)
        .json(
            new ApiResponse(
            StatusCodes.OK,
            "Progress fetched",
            progress
            )
        );

    } catch (error) {
        next(error);
    }
};