import express from "express";
import { createProposal, getAllProposals } from "../controllers/proposalController";
import userAuth from "../middlewares/authMiddleware";

const router = express.Router();

router.post('/create', userAuth, createProposal);
router.get('/get-all', getAllProposals);

export default router;