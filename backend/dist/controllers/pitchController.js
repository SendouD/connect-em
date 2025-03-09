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
exports.investorInterest = exports.getPitch = exports.getAllPitches = exports.createPitch = exports.copyTemplate = void 0;
const pitchModel_1 = __importDefault(require("../models/pitchModel"));
const formModel_1 = require("../models/formModel");
const copyTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = yield formModel_1.Form.findById(req.params.id);
        const pitchForm = yield formModel_1.PitchForm.create({ name: form.name, email: form.email, components: form.components });
        res.status(200).json(pitchForm);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching form", error });
    }
});
exports.copyTemplate = copyTemplate;
const createPitch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    const { domain, type, formId, submittedData } = req.body;
    try {
        const newPitch = new pitchModel_1.default({
            domain,
            type,
            formId,
            email,
            submittedData,
        });
        yield newPitch.save();
        res.status(201).json(newPitch);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating pitch", error });
    }
});
exports.createPitch = createPitch;
const getAllPitches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pitches = yield pitchModel_1.default.find();
        res.status(200).json(pitches);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching pitches", error });
    }
});
exports.getAllPitches = getAllPitches;
const getPitch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pitch = yield pitchModel_1.default.findById(req.params.id);
        res.status(200).json(pitch);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching pitch", error });
    }
});
exports.getPitch = getPitch;
const investorInterest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.email;
        const { id } = req.params;
        const pitch = yield pitchModel_1.default.findById(id);
        if (!pitch) {
            res.status(404).json({ message: "Pitch not found" });
            return;
        }
        if (pitch.investors.includes(email)) {
            res.status(400).json({ message: "You have already invested in this pitch" });
            return;
        }
        pitch.investors.push(email);
        yield pitch.save();
        res.status(200).json(pitch);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching pitch", error });
    }
});
exports.investorInterest = investorInterest;
