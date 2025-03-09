import { Request, Response } from "express";
import Pitch from "../models/pitchModel";
import { Form, PitchForm } from "../models/formModel";

interface CustomRequest extends Request {
    email?: string;
}

export const copyTemplate = async (req: Request, res: Response): Promise<void> => {
    try {
        const form = await Form.findById(req.params.id);
        const pitchForm = await PitchForm.create({ name: form.name, email: form.email, components: form.components });
        res.status(200).json(pitchForm);
    } catch (error) {
        res.status(500).json({ message: "Error fetching form", error });
    }
}

export const createPitch = async (req: CustomRequest, res: Response): Promise<void> => {
    const email = req.email;
    const { domain, type, formId, submittedData, title, description } = req.body

    try {
        const newPitch = new Pitch({
            domain,
            type,
            formId,
            email,
            title,
            description,
            submittedData,
        });

        await newPitch.save();
        res.status(201).json(newPitch);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating pitch", error });
    }
}

export const getAllPitches = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const pitches = await Pitch.find();
        res.status(200).json(pitches);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pitches", error });
    }
}

export const getPitch = async (req: Request, res: Response): Promise<void> => {
    try {
        const pitch = await Pitch.findById(req.params.id);
        res.status(200).json(pitch);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pitch", error });
    }
};

export const investorInterest = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const email = req.email;
        const { id } = req.params;
        const pitch = await Pitch.findById(id);
        if (!pitch) {
             res.status(404).json({ message: "Pitch not found" });
             return ;
        }
        if(pitch.investors.includes(email)){
             res.status(400).json({ message: "You have already invested in this pitch" });
             return;
        }
        pitch.investors.push(email);
        await pitch.save();
        res.status(200).json(pitch);

    } catch (error) {
        res.status(500).json({ message: "Error fetching pitch", error });
    }
};
