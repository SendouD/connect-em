import mongoose from "mongoose";

const pitchSchema = new mongoose.Schema(
  {
    domain: { type: String, required: true },
    type: { type: String, required: true },
    formId: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

export default mongoose.models.Pitch || mongoose.model("pitch", pitchSchema);
