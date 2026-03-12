import { StatusCodes } from "http-status-codes";
import * as enrollmentService from "./enrollment.service.js";
import { ApiError } from "../../utils/ApiError.js";

export const enrollCourse = async (req, res, next) => {
    try{
        const enrollment = await enrollmentService.enrollStudent(
            req.params.courseId,
            req.user.id
        );

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Enrolled successfully",
            data: enrollment
        });

    }catch(error){
        if (error instanceof ApiError) {
            next(error);
        }
    }
};

export const myCourses = async (req, res, next) => {
    try{
        const courses = await enrollmentService.getStudentCourses(req.user.id);

        res.status(StatusCodes.OK).json(
            new ApiResponse(
                StatusCodes.OK,
                "Courses fetched",
                courses
            )
        );
    }catch(error){
        next(error);
    }
};