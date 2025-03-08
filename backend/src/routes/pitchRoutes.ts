import express from "express";
import { copyTemplate, createPitch, getAllPitches, getPitch } from "../controllers/pitchController";
import userAuth from "../middlewares/authMiddleware";
const router = express.Router();

router.post('/copy-template/:id', userAuth, copyTemplate);
router.post('/create', userAuth, createPitch);
router.get('/get-all', getAllPitches);
router.get('/:id', getPitch)

export default router;
