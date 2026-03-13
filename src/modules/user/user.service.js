import * as userRepository from './user.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';


export const getUsers = async() => {
    return userRepository.getAllUsers();
};

export const getProfile = async(id) => {
    const user = await userRepository.getUserById(userId);
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    return user;
};

export const updateProfile = async(userId, data) => {
    return userRepository.updateUser(userId, data);
};


export const changeUserRole = async(userId, role) => {
    return userRepository.updateUser(userId, { role });
};

export const removeUser = async(userId) => {
    return userRepository.deleteUser(userId);
};

