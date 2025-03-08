"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalForm = exports.Form = void 0;
const mongoose = require("mongoose");
const ComponentSchema = new mongoose.Schema({
    input: { type: Boolean, required: true },
    tableView: { type: Boolean, required: true },
    inputType: { type: String, required: true },
    inputMask: { type: String, default: "" },
    label: { type: String, required: true },
    key: { type: String, required: true },
    placeholder: { type: String, default: "" },
    prefix: { type: String, default: "" },
    suffix: { type: String, default: "" },
    multiple: { type: Boolean, default: false },
    defaultValue: { type: String, default: "" },
    protected: { type: Boolean, default: false },
    unique: { type: Boolean, default: false },
    persistent: { type: Boolean, default: true },
    validate: { type: Object, default: {} },
    type: { type: String, required: true },
    tags: { type: [String], default: [] },
    lockKey: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    options: { type: [String], default: [] },
});
const FormSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    components: { type: [ComponentSchema], required: true }
}, { timestamps: true });
exports.Form = mongoose.model("Form", FormSchema);
exports.ProposalForm = mongoose.model("ProposalForm", FormSchema);
