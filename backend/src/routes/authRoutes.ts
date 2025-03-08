import express from "express";
import { getMe, signin, signup } from "../controllers/authController";
import userAuth from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get('/me', userAuth, getMe);

export default router;