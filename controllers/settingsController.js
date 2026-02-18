import CompanyProfile from "../models/CompanyProfile.js";
import Unit from "../models/Unit.js";
import Category from "../models/Category.js";

// GET Company Profile
export const getCompanyProfile = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne();

    if (!profile) {
      return res.json({
        companyName: "",
        address: "",
        phone: "",
        email: "",
        tin: "",
        tradeLicense: "",
      });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE Company Profile
export const updateCompanyProfile = async (req, res) => {
  try {
    const { companyName, address, phone, email, tin, tradeLicense } = req.body;

    let profile = await CompanyProfile.findOne();

    if (!profile) {
      profile = await CompanyProfile.create({
        companyName,
        address,
        phone,
        email,
        tin,
        tradeLicense,
      });
    } else {
      profile.companyName = companyName;
      profile.address = address;
      profile.phone = phone;
      profile.email = email;
      profile.tin = tin;
      profile.tradeLicense = tradeLicense;

      await profile.save();
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Units
export const getUnits = async (req, res) => {
  try {
    const units = await Unit.find().sort({ createdAt: 1 });
    res.json(units);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE Unit
export const createUnit = async (req, res) => {
  try {
    const { name } = req.body;

    const exists = await Unit.findOne({ name });
    if (exists) return res.status(400).json({ message: "Unit already exists" });

    const unit = await Unit.create({ name });
    res.status(201).json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE Unit
export const updateUnit = async (req, res) => {
  try {
    const { id } = req.params;

    const unit = await Unit.findByIdAndUpdate(id, req.body, { new: true });

    if (!unit) return res.status(404).json({ message: "Unit not found" });

    res.json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE Unit
export const deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;

    const unit = await Unit.findByIdAndDelete(id);

    if (!unit) return res.status(404).json({ message: "Unit not found" });

    res.json({ message: "Unit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE Category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const exists = await Category.findOne({ name });
    if (exists)
      return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({ name });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
