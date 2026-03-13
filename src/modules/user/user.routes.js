import express from "express";
import * as userController from "./user.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", authenticate, authorize("admin"), userController.getUsers);

router.get("/me", authenticate, userController.getMe);

router.patch("/me", authenticate, userController.updateMe);

router.patch(
    "/:id/role",
    authenticate,
    authorize("admin"),
    userController.changeRole
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    userController.deleteUser
);

export default router;