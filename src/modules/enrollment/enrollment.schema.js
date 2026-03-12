import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        progress: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

enrollmentSchema.index(
    { studentId: 1, courseId: 1 },
    { unique: true }
);

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);