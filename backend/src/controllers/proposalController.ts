import { Request, Response } from "express";
import Proposal from '../models/proposalModel';

interface CustomRequest extends Request {
    email?: string;
}

export const createProposal = async (req: CustomRequest, res: Response) => {
    try {
        const { investments, formId, isPublic, title, description } = req.body;
        const email = req.email;

        console.log(investments, formId, isPublic, email);

        if (!Array.isArray(investments)) {
            res.status(400).json({ message: 'Investments should be an array' });
            return;
        }

        const proposals = [];

        for (const investment of investments) {
            const { domain, type, amount } = investment;

            const newProposal = new Proposal({
                title,
                description,
                domain,
                type,
                amount,
                formId,
                isPublic,
                email,
            });

            await newProposal.save();

            proposals.push(newProposal);
        }

        res.status(201).json({ message: 'Proposals created successfully', proposals });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating proposals', error });
    }
};

export const getAllProposals = async (req: Request, res: Response) => {
    try {
        const proposals = await Proposal.find();
        res.status(200).json({ proposals });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching proposals', error });
    }
};

export const getInvestorProposals = async (req: CustomRequest, res: Response) => {
    try {
        const email = req.email;
        const proposals = await Proposal.find({ email });
        res.status(200).json(proposals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching proposals', error });
    }
}

export const getProposal = async (req: Request, res: Response) => {
    try {
        const proposal = await Proposal.findById(req.params.proposalId);
        res.status(200).json(proposal);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching proposal', error });
    }
}