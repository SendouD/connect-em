"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvestorProposals = exports.getAllProposals = exports.createProposal = void 0;
const proposalModel_1 = __importDefault(require("../models/proposalModel"));
const createProposal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { investments, formId, isPublic } = req.body;
        const email = req.email;
        console.log(investments, formId, isPublic, email);
        if (!Array.isArray(investments)) {
            res.status(400).json({ message: 'Investments should be an array' });
            return;
        }
        const proposals = [];
        for (const investment of investments) {
            const { domain, type, amount } = investment;
            const newProposal = new proposalModel_1.default({
                domain,
                type,
                amount,
                formId,
                isPublic,
                email,
            });
            yield newProposal.save();
            proposals.push(newProposal);
        }
        res.status(201).json({ message: 'Proposals created successfully', proposals });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating proposals', error });
    }
});
exports.createProposal = createProposal;
const getAllProposals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const proposals = yield proposalModel_1.default.find();
        res.status(200).json({ proposals });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching proposals', error });
    }
});
exports.getAllProposals = getAllProposals;
const getInvestorProposals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.email;
        const proposals = yield proposalModel_1.default.find({ email });
        res.status(200).json(proposals);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching proposals', error });
    }
});
exports.getInvestorProposals = getInvestorProposals;
