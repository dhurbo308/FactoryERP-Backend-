import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    billId: { type: String, required: true, unique: true },
    month: { type: String, required: true },
    category: { type: String, enum: ["Factory", "Office"], required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
  },
  { timestamps: true }
);

export default mongoose.model("Salary", salarySchema);
