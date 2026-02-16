import mongoose from "mongoose";

const expenseItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    rate: { type: Number, required: true },
  },
  { _id: false }
);

const expenseSchema = new mongoose.Schema(
  {
    expenseId: {
      type: String,
      required: true,
      unique: true, // EXP001
    },
    date: {
      type: Date, // store like "2026-06-01" to match frontend
      required: true,
    },
    supplier: {
      type: String,
      required: true, // supplier name
    },
    project: {
      type: String,
      required: true, // project name
    },
    category: {
      type: String,
      required: true,
    },
    expenseItems: {
      type: [expenseItemSchema],
      default: [],
    },
    items: {
      type: String,
      default: "0 items",
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
