import Sale from "../models/Sale.js";
import Project from "../models/Project.js";
import Expense from "../models/Expense.js";

const recalcProject = async (projectName) => {

  const totalExpense = await Expense.aggregate([
    { $match: { project: projectName } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const totalSales = await Sale.aggregate([
    { $match: { project: projectName } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);

  const expenseAmount = totalExpense[0]?.total || 0;
  const revenueAmount = totalSales[0]?.total || 0;

  await Project.findOneAndUpdate(
    { name: projectName },
    {
      revenue: revenueAmount,
      totalCost: expenseAmount,
      profit: revenueAmount - expenseAmount,
    }
  );
};


// CREATE Sale
export const createSale = async (req, res) => {
  try {
    const { saleId, project, quantity, unitPrice, date } = req.body;

    if (!saleId || !project || !quantity || !unitPrice || !date) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const totalAmount = quantity * unitPrice;

    const sale = await Sale.create({
      saleId,
      project,
      quantity,
      unitPrice,
      totalAmount,
      date,
    });

    await recalcProject(project);

    res.status(201).json(sale);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET Sales
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
