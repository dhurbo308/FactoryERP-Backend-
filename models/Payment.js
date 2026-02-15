import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true, // PAY001
    },
    date: {
      type: String, // store as "YYYY-MM-DD"
      required: true,
    },
    supplier: {
      type: String,
      required: true,
    },
    project: {
      type: String,
      required: true,
    },
    totalBill: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    due: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Partial"],
      default: "Partial",
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
