import Project from "../models/Project.js";
import Expense from "../models/Expense.js";
import Supplier from "../models/Supplier.js";
import Payment from "../models/Payment.js";

// GET dashboard summary
export const getDashboardSummary = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();

    const totalExpenseAgg = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpense = totalExpenseAgg[0]?.total || 0;

    const supplierAgg = await Supplier.aggregate([
      { $group: { _id: null, totalDue: { $sum: "$due" } } },
    ]);

    const totalSupplierDue = supplierAgg[0]?.totalDue || 0;

    const paymentAgg = await Payment.aggregate([
      { $group: { _id: null, totalPaid: { $sum: "$paidAmount" } } },
    ]);

    const totalPaid = paymentAgg[0]?.totalPaid || 0;

    const netProfit = totalPaid - totalExpense;

    res.json({
      totalProjects,
      totalExpense,
      totalSupplierDue,
      netProfit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenseByCategory = async (req, res) => {
  try {
    const data = await Expense.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMonthlyTrend = async (req, res) => {
  try {
    const expenses = await Expense.aggregate([
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] }, // YYYY-MM
          totalExpense: { $sum: "$amount" },
        },
      },
    ]);

    const payments = await Payment.aggregate([
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] },
          totalIncome: { $sum: "$paidAmount" },
        },
      },
    ]);

    res.json({ expenses, payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
