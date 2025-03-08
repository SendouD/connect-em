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
exports.approveApplication = exports.rejectApplication = exports.getProposalSubmittedForms = exports.getFilledForm = exports.copyTemplate = exports.getProposalForm = exports.updateProposalForm = exports.createProposalForm = exports.getAllForms = exports.userSubmittedForms = exports.submitForm = exports.getForm = exports.updateForm = exports.createForm = void 0;
const formModel_1 = require("../models/formModel");
const formSubmissionModel_1 = __importDefault(require("../models/formSubmissionModel"));
const proposalModel_1 = __importDefault(require("../models/proposalModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const createForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, components } = req.body;
    const email = req.email;
    try {
        if (!name || !email) {
            res.status(400).json({ message: "Name, email, and components are required" });
            return;
        }
        const newForm = new formModel_1.Form({
            name,
            email,
            components,
        });
        yield newForm.save();
        res.status(201).json(newForm);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});
exports.createForm = createForm;
const updateForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, components } = req.body;
    const email = req.email;
    try {
        if (!name || !email || !components || !id) {
            res.status(400).json({ message: "Name, email, and components are required" });
            return;
        }
        const form = yield formModel_1.Form.findById(id);
        if (!form) {
            res.status(404).json({ message: "Form not found" });
            return;
        }
        if (form.email !== email && email) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const updatedForm = yield formModel_1.Form.findByIdAndUpdate(id, { name, email, components }, { new: true });
        res.status(200).json(updatedForm);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});
exports.updateForm = updateForm;
const getForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = yield formModel_1.Form.findById(req.params.id);
        res.status(200).json(form);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching form", error });
    }
});
exports.getForm = getForm;
const submitForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.email;
        const { proposalId } = req.params;
        const submittedData = req.body;
        const proposal = yield proposalModel_1.default.findById(proposalId);
        if (!proposal) {
            res.status(404).json({ message: "Proposal not found" });
            return;
        }
        const proposalForm = yield formModel_1.ProposalForm.findById(proposal.formId);
        const check = yield formSubmissionModel_1.default.findOne({ proposalId, email });
        if (check) {
            res.status(400).json({ message: "You have already submitted this form" });
            return;
        }
        if (!proposalForm) {
            res.status(404).json({ message: "Form not found" });
            return;
        }
        const validLabels = proposalForm.components.map((component) => component.label);
        const validatedData = {};
        validLabels.forEach((label) => {
            if (submittedData.hasOwnProperty(label)) {
                validatedData[label] = submittedData[label];
            }
        });
        const submission = new formSubmissionModel_1.default({
            proposalId,
            formId: proposalForm._id,
            email,
            submittedData: validatedData,
        });
        yield submission.save();
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        user.proposals.push(proposalId);
        yield user.save();
        res.status(201).json({ message: "Form submitted successfully", submission });
    }
    catch (error) {
        res.status(500).json({ message: "Error submitting form", error });
    }
});
exports.submitForm = submitForm;
const userSubmittedForms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    const user = yield userModel_1.default.findOne({ email });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    const proposalIds = user.proposals;
    if (!proposalIds.length) {
        res.status(200).json({ proposals: [] });
        return;
    }
    const userProposals = yield Promise.all(proposalIds.map((proposalId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const proposal = yield proposalModel_1.default.findById(proposalId);
            return proposal;
        }
        catch (error) {
            console.error(`Error fetching proposal ${proposalId}:`, error);
            return null;
        }
    })));
    res.status(200).json({ proposals: userProposals });
});
exports.userSubmittedForms = userSubmittedForms;
const getAllForms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.email;
    console.log(email);
    try {
        const forms = yield formModel_1.Form.find({ email });
        console.log(forms);
        res.status(200).json(forms);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching forms", error });
    }
});
exports.getAllForms = getAllForms;
const createProposalForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, components } = req.body;
    const email = req.email;
    console.log(name);
    try {
        if (!name || !email) {
            res.status(400).json({ message: "Name, email, and components are required" });
            return;
        }
        const newProposalForm = new formModel_1.ProposalForm({
            name,
            email,
            components,
        });
        yield newProposalForm.save();
        res.status(201).json(newProposalForm);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});
exports.createProposalForm = createProposalForm;
const updateProposalForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, components } = req.body;
    const email = req.email;
    try {
        if (!name || !email || !components || !id) {
            res.status(400).json({ message: "Name, email, and components are required" });
            return;
        }
        const proposalForm = yield formModel_1.ProposalForm.findById(id);
        if (!proposalForm) {
            res.status(404).json({ message: "Form not found" });
            return;
        }
        if (proposalForm.email !== email && email) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const updatedProposalForm = yield formModel_1.ProposalForm.findByIdAndUpdate(id, { name, email, components }, { new: true });
        res.status(200).json(updatedProposalForm);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});
exports.updateProposalForm = updateProposalForm;
const getProposalForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const proposalForm = yield formModel_1.ProposalForm.findById(req.params.id);
        res.status(200).json(proposalForm);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching form", error });
    }
});
exports.getProposalForm = getProposalForm;
const copyTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = yield formModel_1.Form.findById(req.params.id);
        const proposalForm = yield formModel_1.ProposalForm.create({ name: form.name, email: form.email, components: form.components });
        res.status(200).json(proposalForm);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching form", error });
    }
});
exports.copyTemplate = copyTemplate;
const getFilledForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { proposalId } = req.params;
    const email = req.email;
    try {
        const submission = yield formSubmissionModel_1.default.findOne({ proposalId, email });
        res.status(200).json(submission);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching forms", error });
    }
});
exports.getFilledForm = getFilledForm;
const getProposalSubmittedForms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { proposalId } = req.params;
    try {
        const submissions = yield formSubmissionModel_1.default.find({ proposalId });
        res.status(200).json(submissions);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching forms", error });
    }
});
exports.getProposalSubmittedForms = getProposalSubmittedForms;
const rejectApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { applicationId } = req.params;
    const email = req.email;
    try {
        let submission = yield formSubmissionModel_1.default.findById(applicationId);
        if (!submission) {
            res.status(404).json({ message: "Submission not found" });
            return;
        }
        const proposalId = submission.proposalId;
        const proposal = yield proposalModel_1.default.findById(proposalId);
        if (!proposal) {
            res.status(404).json({ message: "Proposal not found" });
            return;
        }
        if (proposal.email !== email) {
            res.status(403).json({ message: "Unauthorized: You don't have permission to reject this application" });
            return;
        }
        submission.isRejected = true;
        submission.isApproved = false;
        yield submission.save();
        res.status(200).json(submission);
    }
    catch (error) {
        res.status(500).json({ message: "Error processing application rejection", error });
    }
});
exports.rejectApplication = rejectApplication;
const approveApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { applicationId } = req.params;
    const email = req.email;
    try {
        let submission = yield formSubmissionModel_1.default.findById(applicationId);
        if (!submission) {
            res.status(404).json({ message: "Submission not found" });
            return;
        }
        const proposalId = submission.proposalId;
        const proposal = yield proposalModel_1.default.findById(proposalId);
        if (!proposal) {
            res.status(404).json({ message: "Proposal not found" });
            return;
        }
        if (proposal.email !== email) {
            res.status(403).json({ message: "Unauthorized: You don't have permission to approve this application" });
            return;
        }
        submission.isApproved = true;
        submission.isRejected = false;
        yield submission.save();
        res.status(200).json(submission);
    }
    catch (error) {
        res.status(500).json({ message: "Error processing application approval", error });
    }
});
exports.approveApplication = approveApplication;
