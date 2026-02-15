import Expense from "../models/Expense.js";
import Supplier from "../models/Supplier.js";
import Project from "../models/Project.js";

// GET all expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE expense
export const createExpense = async (req, res) => {
  try {
    const {
      expenseId,
      date,
      supplier,
      project,
      category,
      expenseItems,
      amount,
    } = req.body;

    if (!expenseId || !date || !supplier || !project || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const exists = await Expense.findOne({ expenseId });
    if (exists) {
      return res.status(400).json({ message: "Expense ID already exists" });
    }

    const newExpense = await Expense.create({
      expenseId,
      date,
      supplier,
      project,
      category,
      expenseItems,
      items: `${expenseItems.length} items`,
      amount,
    });

    // Update Supplier totalBill & due
    const supplierDoc = await Supplier.findOne({ name: supplier });
    if (supplierDoc) {
      supplierDoc.totalBill += amount;
      supplierDoc.due = supplierDoc.totalBill - supplierDoc.paid;
      await supplierDoc.save();
    }

    //  Update Project totalCost
    const projectDoc = await Project.findOne({ name: project });
    if (projectDoc) {
      projectDoc.totalCost += amount;
      await projectDoc.save();
    }

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE expense
export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const oldExpense = await Expense.findById(id);

    if (!oldExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE expense
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Expense.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    //  Reduce Supplier totalBill & due
    const supplierDoc = await Supplier.findOne({ name: deleted.supplier });
    if (supplierDoc) {
      supplierDoc.totalBill -= deleted.amount;
      supplierDoc.due = supplierDoc.totalBill - supplierDoc.paid;
      await supplierDoc.save();
    }

    //  Reduce Project totalCost
    const projectDoc = await Project.findOne({ name: deleted.project });
    if (projectDoc) {
      projectDoc.totalCost -= deleted.amount;
      await projectDoc.save();
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
