import { StatusCodes } from "http-status-codes";
import * as courseService from "./course.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const createCourse = async (req, res, next) => {
    try{
        const course = await courseService.createCourse(
            req.body, 
            req.user.id
        );

        res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, course, "Course created successfully"));
    }catch(error){
        next(error);
    }
};

export const getCourses = async (req, res, next) => {
    try {

        const courses = await courseService.getCourses(req.query);

        res
        .status(StatusCodes.OK)
        .json(
            new ApiResponse(
                StatusCodes.OK,
                "Courses fetched",
                courses
            )
        );

    } catch (error) {
        next(error);
    }
};

export const updateCourse = async (req, res, next) => {
    try{
        const course = await courseService.updateCourse(
            req.params.id, 
            req.body, 
            req.user.id
        );
        res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, course, "Course updated successfully"));
    }catch(error){
        next(error);
    }
};

export const deleteCourse = async (req, res, next) => {
    try{
        await courseService.deleteCourse(
            req.params.id, 
            req.user.id
        );
        res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, "Course deleted successfully"));
    }catch(error){
        next(error);
    }
};