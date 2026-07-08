

import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      default: "",
    },

    permissions: {
      dashboard: { type: Boolean, default: false },
      projects: { type: Boolean, default: false },
      items: { type: Boolean, default: false },
      suppliers: { type: Boolean, default: false },
      expenses: { type: Boolean, default: false },
      payments: { type: Boolean, default: false },
      salary: { type: Boolean, default: false },
      reports: { type: Boolean, default: false },
      settings: { type: Boolean, default: false },
      backup: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Role", roleSchema);
