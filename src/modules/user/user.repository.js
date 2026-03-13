import { User } from './user.schema.js';

export const getAllUsers = () => {
    return User.find();
};

export const getUserById = (id) => {
    return User.findById(id);
};

export const updateUser = (id, data) => {
    return User.findByIdAndUpdate(id, data, { new: true });
};

export const deleteUser = (id) => {
    return User.findByIdAndDelete(id);
};

