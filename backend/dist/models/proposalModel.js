"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const ProposalSchema = new mongoose.Schema({
    email: { type: String, required: true },
    domain: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProposalForm', required: true },
    isPublic: { type: Boolean, default: false },
}, { timestamps: true });
const Proposal = mongoose.model("Proposal", ProposalSchema);
exports.default = Proposal;
