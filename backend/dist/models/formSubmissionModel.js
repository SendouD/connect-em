"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SubmissionSchema = new mongoose_1.default.Schema({
    proposalId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Proposal",
        required: true,
    },
    formId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "ProposalForm",
        required: true,
    },
    email: { type: String, required: true },
    submittedData: {
        type: Object,
        default: {},
    },
    isApproved: { type: Boolean, default: false },
    isRejected: { type: Boolean, default: false },
    isSubmitted: { type: Boolean, default: true },
    isPaid: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = mongoose_1.default.models.Submission || mongoose_1.default.model("Submission", SubmissionSchema);
