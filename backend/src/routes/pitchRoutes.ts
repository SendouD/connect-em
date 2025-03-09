import express from "express";
import { copyTemplate, createPitch, getAllPitches, getPitch , investorInterest, fetchPitches} from "../controllers/pitchController";
import userAuth from "../middlewares/authMiddleware";
const router = express.Router();

router.post('/copy-template/:id', userAuth, copyTemplate);
router.post('/create', userAuth, createPitch);
router.get('/get-all', getAllPitches);
router.get('/get-user',userAuth, fetchPitches);
router.get('/:id', getPitch)
router.patch('/investor-interest/:id', userAuth, investorInterest);

export default router;