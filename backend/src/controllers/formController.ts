import { Request, Response } from "express";
import { Form, ProposalForm } from "../models/formModel";
import Submission from "../models/formSubmissionModel";
import Proposal from "../models/proposalModel";

interface CustomRequest extends Request {
    email?: string;
}

export const createForm = async (req: CustomRequest, res: Response) => {
    const { name, components } = req.body;
    const email = req.email

    try {
        if (!name || !email ) {
            res.status(400).json({ message: "Name, email, and components are required" });
            return;
        }

        const newForm = new Form({
            name,
            email,
            components,
        });

        await newForm.save();
        res.status(201).json(newForm);

    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};

export const updateForm = async (req: CustomRequest, res: Response) => {
    const { id, name, components } = req.body;
    const email = req.email

    try {
        if (!name || !email || !components || !id) {
            res.status(400).json({ message: "Name, email, and components are required" });
            return;
        }

        const form = await Form.findById(id);
        if (!form) {
            res.status(404).json({ message: "Form not found" });
            return;
        }
        if(form.email !== email && email) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const updatedForm = await Form.findByIdAndUpdate(id, { name, email, components }, { new: true });
        res.status(200).json(updatedForm);

    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};

export const getForm = async (req: Request, res: Response) => {
    try {
        const form = await Form.findById(req.params.id);
        res.status(200).json(form);
    } catch (error) {
        res.status(500).json({ message: "Error fetching form", error });
    }
};

export const submitForm = async (req: CustomRequest, res: Response) => {
    try {
        const email = req.email;  
        const {proposalId} = req.params;
        const submittedData = req.body;

        const proposal = await Proposal.findById(proposalId);
        if(!proposal) {
            res.status(404).json({ message: "Proposal not found" });
            return;
        }
        const proposalForm = await ProposalForm.findById(proposal.formId);
        const check = await Submission.findOne({ proposalId, email });

        if(check) {
            res.status(400).json({ message: "You have already submitted this form" });
            return;
        }

        if (!proposalForm) {
            res.status(404).json({ message: "Form not found" });
            return;
        }

        const validLabels = proposalForm.components.map((component: { label: any; }) => component.label);

        const validatedData: Record<string, string> = {};

        validLabels.forEach((label: string | number) => {
            if (submittedData.hasOwnProperty(label)) {
                validatedData[label] = submittedData[label];
            }
        });

        const submission = new Submission({
            proposalId,
            formId: proposalForm._id,
            email,
            submittedData: validatedData,
        });

        await submission.save();

        res.status(201).json({ message: "Form submitted successfully", submission });
    } catch (error) {
        res.status(500).json({ message: "Error submitting form", error });
    }
};

export const getAllForms = async (req: CustomRequest, res: Response) => {
    const email = req.email
    console.log(email);

    try {
        const forms = await Form.find({email});
        console.log(forms)
        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ message: "Error fetching forms", error });
    }
}

export const createProposalForm = async (req: CustomRequest, res: Response) => {
    const { name, components } = req.body;
    const email = req.email

    console.log(name);

    try {
        if (!name || !email ) {
            res.status(400).json({ message: "Name, email, and components are required" });
            return;
        }

        const newProposalForm = new ProposalForm({
            name,
            email,
            components,
        });

        await newProposalForm.save();
        res.status(201).json(newProposalForm);

    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};

export const updateProposalForm = async (req: CustomRequest, res: Response) => {
    const { id, name, components } = req.body;
    const email = req.email

    try {
        if (!name || !email || !components || !id) {
            res.status(400).json({ message: "Name, email, and components are required" });
            return;
        }

        const proposalForm = await ProposalForm.findById(id);
        if (!proposalForm) {
            res.status(404).json({ message: "Form not found" });
            return;
        }
        if(proposalForm.email !== email && email) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const updatedProposalForm = await ProposalForm.findByIdAndUpdate(id, { name, email, components }, { new: true });
        res.status(200).json(updatedProposalForm);

    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
};

export const getProposalForm = async (req: Request, res: Response) => {
    try {
        const proposalForm = await ProposalForm.findById(req.params.id);
        res.status(200).json(proposalForm);
    } catch (error) {
        res.status(500).json({ message: "Error fetching form", error });
    }
};

export const copyTemplate = async (req: Request, res: Response) => {
    try {
        const form = await Form.findById(req.params.id);
        const proposalForm = await ProposalForm.create({ name: form.name, email: form.email, components: form.components });
        res.status(200).json(proposalForm);
    } catch (error) {
        res.status(500).json({ message: "Error fetching form", error });
    }
}

export const getFilledForm = async (req: CustomRequest, res: Response) => {
    const { proposalId } = req.params;
    const email = req.email;

    try {
        const submission = await Submission.findOne({proposalId, email});
        res.status(200).json(submission);
    } catch (error) {
        res.status(500).json({ message: "Error fetching forms", error });
    }
}