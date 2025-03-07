import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      required: true,
    },
    formId: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
