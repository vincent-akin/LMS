import express from "express";
import { logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/error.middleware-.js";

import authRoutes from "./modules/auth/auth.routes.js";


const app = express();

// Middleware
app.use(express.json());
app.use(logger);

app.use("/api/auth", authRoutes);

app.use(errorHandler);

// Routes
export default app;