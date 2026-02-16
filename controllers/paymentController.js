import Payment from "../models/Payment.js";
import Supplier from "../models/Supplier.js";
import Expense from "../models/Expense.js";
// GET all payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE payment
export const createPayment = async (req, res) => {
  try {
    const {
      paymentId,
      date,
      supplier,
      project,
      totalBill,
      paidAmount,
      due,
      method,
      status,
    } = req.body;

    if (!paymentId || !date || !supplier || !project || !method) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const exists = await Payment.findOne({ paymentId });
    if (exists) {
      return res.status(400).json({ message: "Payment ID already exists" });
    }

    const newPayment = await Payment.create({
      paymentId,
      date,
      supplier,
      project,
      totalBill,
      paidAmount,
      due,
      method,
      status,
    });

    // Update supplier paid & due
    const supplierDoc = await Supplier.findOne({ name: supplier });

    if (supplierDoc) {
      supplierDoc.paid += paidAmount;
      supplierDoc.due = supplierDoc.totalBill - supplierDoc.paid;
      await supplierDoc.save();
    }

    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const oldPayment = await Payment.findById(id);
    if (!oldPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const updatedPayment = await Payment.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // Update supplier paid & due properly
    const supplierDoc = await Supplier.findOne({ name: oldPayment.supplier });

    if (supplierDoc) {
      // rollback old paidAmount
      supplierDoc.paid -= oldPayment.paidAmount;

      // apply new paidAmount
      supplierDoc.paid += updatedPayment.paidAmount;

      // recalculate due
      supplierDoc.due = supplierDoc.totalBill - supplierDoc.paid;

      await supplierDoc.save();
    }

    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE payment
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Payment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // 🔥 Rollback supplier paid & due
    const supplierDoc = await Supplier.findOne({ name: deleted.supplier });

    if (supplierDoc) {
      supplierDoc.paid -= deleted.paidAmount;
      supplierDoc.due = supplierDoc.totalBill - supplierDoc.paid;
      await supplierDoc.save();
    }

    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSupplierProjectBill = async (req, res) => {
  const { supplier, project } = req.query;

  const total = await Expense.aggregate([
    {
      $match: { supplier, project }
    },
    {
      $group: {
        _id: null,
        totalBill: { $sum: "$amount" }
      }
    }
  ]);

  res.json({ totalBill: total[0]?.totalBill || 0 });
};

