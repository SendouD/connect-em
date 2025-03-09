"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const pitchSchema = new mongoose_1.default.Schema({
    domain: { type: String, required: true },
    type: { type: String, required: true },
    formId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "PitchForm",
        required: true,
    },
    email: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    submittedData: {
        type: Object,
        default: {},
    },
    investors: { type: [String], default: [] },
    isPaid: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = mongoose_1.default.models.Pitch || mongoose_1.default.model("pitch", pitchSchema);
