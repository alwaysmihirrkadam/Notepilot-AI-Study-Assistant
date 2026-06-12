// routes/userRoutes.js

import express from "express";
import { login, register, userDetails } from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/userDetails", authMiddleware, userDetails);

export default router;