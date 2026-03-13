import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true,
            select: false // Exclude password from query results by default
        },

        role:{
            type: String,
            enum: ["student", "instructor", "admin"],
            default: 'student'
        }
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);