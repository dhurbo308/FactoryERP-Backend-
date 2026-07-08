


import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },
    
    phone: { type: String, default: "" },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "manager", "staff"],
      default: "staff",
    },

    permissions: {
      dashboard: { type: Boolean, default: true },
      projects: { type: Boolean, default: false },
      expenses: { type: Boolean, default: false },
      payments: { type: Boolean, default: false },
      reports: { type: Boolean, default: false },
      suppliers: { type: Boolean, default: false },
      settings: { type: Boolean, default: false },
      backup: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
