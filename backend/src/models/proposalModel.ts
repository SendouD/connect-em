const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema({
    domain: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProposalForm', required: true }, 
    isPublic: { type: Boolean, default: false },
}, { timestamps: true });

const Proposal = mongoose.model("Proposal", ProposalSchema);

export default Proposal;
