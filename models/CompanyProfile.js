import mongoose from "mongoose";

const companyProfileSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    tin: { type: String },
    tradeLicense: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("CompanyProfile", companyProfileSchema);
