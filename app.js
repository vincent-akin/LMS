import express from "express";
import userRoutes from "./src/modules/user/user.route.js";

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);

export default app;