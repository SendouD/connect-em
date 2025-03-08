import { Request, Response } from "express";
import Pitch from "../models/pitchModel";
import { Form, PitchForm } from "../models/formModel";

interface CustomRequest extends Request {
    email?: string;
}

export const copyTemplate = async (req: Request, res: Response) => {
    try {
        const form = await Form.findById(req.params.id);
        const pitchForm = await PitchForm.create({ name: form.name, email: form.email, components: form.components });
        res.status(200).json(pitchForm);
    } catch (error) {
        res.status(500).json({ message: "Error fetching form", error });
    }
}

export const createPitch = async (req: CustomRequest, res: Response) => {
    const email = req.email;
    const { formId, submittedData } = req.body

    try {
        const newPitch = new Pitch({
            formId,
            email,
            submittedData,
        });

        await newPitch.save();
        res.status(201).json(newPitch);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating pitch", error });
    }
}
