import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        lessonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
            required: true
        },

        completed: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

progressSchema.index(
    { studentId: 1, lessonId: 1 },
    { unique: true }
);

export const Progress = mongoose.model("Progress",progressSchema
);