import express from "express";
import { createProposal, getAllProposals, getInvestorProposals } from "../controllers/proposalController";
import userAuth from "../middlewares/authMiddleware";

const router = express.Router();

router.post('/create', userAuth, createProposal);
router.get('/get-all', getAllProposals);
router.get('/investor', userAuth, getInvestorProposals)

export default router;