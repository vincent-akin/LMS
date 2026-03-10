import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import * as authRepo from './auth.repository.js';
import { ApiError } from '../../utils/apiError.js';

export const registerUser = async ( name, email, password ) => {
    // Check if user already exists
    const existingUser = await authRepo.findUserByEmail(email);
    if (existingUser) {
        throw new ApiError(StatusCodes.CONFLICT, 'User already exists');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    const user = await authRepo.createUser({
        name,
        email,
        password: hashedPassword
    });

    return user;
}

export const loginUser = async( email, password ) => {
    // Find the user by email
    const user = await authRepo.findUserByEmail(email);
    if (!user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await user.comparePassword(password);
    
    if (!passwordMatch) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    }

    // Generate a JWT token
    const token = jwt.sign(
        {
        userId: user._id,
        role: user.role
    }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );
    return { user, token };
    
};