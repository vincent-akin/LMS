import { StatusCodes } from "http-status-codes";
import { ApiError } from "../utils/ApiError.js";

export const authorize = (...roles) => {
    return ( req, res, next ) => {
        if (!roles.includes(req.user.role)) {
            return next(new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission'));
        };
        next();
    };
};