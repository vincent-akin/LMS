import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
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

    role: {
        type: String,
        enum: ["student", "instructor", "admin"],
        default: 'student'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    
},
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);

