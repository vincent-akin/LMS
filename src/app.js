import express from "express";
//import { logger } from "./middleware/logger.js";
//import { errorHandler } from "./middleware/error.middleware-.js";

import authRoutes from "./modules/auth/auth.routes.js";
import courseRoutes from "./modules/course/course.routes.js";
import lessonRoutes from "./modules/lesson/lesson.routes.js";
import enrollmentRoutes from "./modules/enrollment/enrollment.routes.js";
import progressRoutes from "./modules/progress/progress.routes.js";


const app = express();

// Middleware
app.use(express.json());
app.use(logger);

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes);

app.use(errorHandler);

// Routes
export default app;