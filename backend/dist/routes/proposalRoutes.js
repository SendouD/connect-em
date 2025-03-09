"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const proposalController_1 = require("../controllers/proposalController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
router.post('/create', authMiddleware_1.default, proposalController_1.createProposal);
router.get('/get-all', proposalController_1.getAllProposals);
router.get('/investor', authMiddleware_1.default, proposalController_1.getInvestorProposals);
router.get('/:proposalId', proposalController_1.getProposal);
exports.default = router;
