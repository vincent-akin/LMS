import { StatusCodes } from "http-status-codes";
import * as authService from "./auth.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const register = async( req, res, next ) => {
    try{
        const user = await authService.registerUser(req.body);

        res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, "User registered successfully", user));
    }catch(error){
        next(error);
    }
};

export const login = async( req, res, next ) => {
    try{
        const { user, token } = await authService.loginUser(req.body);

        res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, "Login successful", { user, token }));
    }catch(error){
        next(error);
    }
};