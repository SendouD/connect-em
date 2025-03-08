import express from "express";
import { approveApplication, copyTemplate, createForm, createProposalForm, getAllForms, getFilledForm, getForm, getProposalForm, getProposalSubmittedForms, rejectApplication, submitForm, updateForm, updateProposalForm } from "../controllers/formController";

const router = express.Router();

router.post('/', createForm);
router.put('/', updateForm);
router.get('/get-all', getAllForms);
router.get('/:id', getForm);
router.post('/submit/:proposalId', submitForm);
router.post('/proposal-form', createProposalForm);
router.put('/proposal-form', updateProposalForm);
router.get('/proposal-form/:id', getProposalForm);
router.post('/copy-template/:id', copyTemplate);
router.get('/get-filled-form/:proposalId', getFilledForm);
router.get('/submissions/:proposalId', getProposalSubmittedForms);
router.put('/submission/reject/:applicationId', rejectApplication);
router.put('/submission/approve/:applicationId', approveApplication);

export default router;
