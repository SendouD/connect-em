import express from "express";
import { copyTemplate, createPitch } from "../controllers/pitchController";
import userAuth from "../middlewares/authMiddleware";
const router = express.Router();

router.post('/copy-template/:id', userAuth, copyTemplate);
router.post('/create', userAuth, createPitch);

export default router;
