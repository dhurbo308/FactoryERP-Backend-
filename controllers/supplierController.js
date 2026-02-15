import Supplier from "../models/Supplier.js";

// GET all suppliers
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single supplier by supplierId (SUP001)
export const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findOne({ supplierId: id });

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE supplier
export const createSupplier = async (req, res) => {
  try {
    const { supplierId, name, contact, address } = req.body;

    if (!supplierId || !name || !contact) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const exists = await Supplier.findOne({ supplierId });

    if (exists) {
      return res.status(400).json({ message: "Supplier ID already exists" });
    }

    const newSupplier = await Supplier.create({
      supplierId,
      name,
      contact,
      address,
      totalBill: 0,
      paid: 0,
      due: 0,
    });

    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE supplier
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Supplier.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE supplier
export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Supplier.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
