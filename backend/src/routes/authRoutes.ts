import express from "express";
import { getMe, signin, signup } from "../controllers/authController";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get('/me', getMe);

export default router;