import mongoose from "mongoose";

const salaryBillSchema = new mongoose.Schema(
  {
    billId: { type: String, required: true, unique: true },
    month: { type: String, required: true },
    category: { type: String, required: true }, // Factory / Office
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("SalaryBill", salaryBillSchema);
