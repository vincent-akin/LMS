import { User } from './auth.schema.js';

export const createUser = (data) => {
    return User.create(data);
};

export const findUserByEmail = (email) => {
    return User.findOne({ email }).select('+password'); // Include password in the result
}; 