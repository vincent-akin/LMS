import { StatusCodes } from "http-status-codes";

export const errorHandler = (err, req, res, next) => {
    const statusCode =
        err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
};