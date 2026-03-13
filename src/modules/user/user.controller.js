import * as userService from "./user.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { StatusCodes } from "http-status-codes";

export const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getUsers();

        res
        .status(StatusCodes.OK)
        .json(new ApiResponse(StatusCodes.OK, "Users fetched", users));
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await userService.getProfile(req.user.id);

        res
        .status(StatusCodes.OK)
        .json(new ApiResponse(StatusCodes.OK, "Profile fetched", user));
    } catch (error) {
        next(error);
    }
};

export const updateMe = async (req, res, next) => {
    try {
        const user = await userService.updateProfile(req.user.id, req.body);

        res
        .status(StatusCodes.OK)
        .json(new ApiResponse(StatusCodes.OK, "Profile updated", user));
    } catch (error) {
        next(error);
    }
};

export const changeRole = async (req, res, next) => {
    try {
        const user = await userService.changeUserRole(
        req.params.id,
        req.body.role
        );

        res
        .status(StatusCodes.OK)
        .json(new ApiResponse(StatusCodes.OK, "Role updated", user));
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        await userService.removeUser(req.params.id);

        res
        .status(StatusCodes.OK)
        .json(new ApiResponse(StatusCodes.OK, "User deleted"));
    } catch (error) {
        next(error);
    }
};