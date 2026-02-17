import Project from "../models/Project.js";
import Expense from "../models/Expense.js";
import Sale from "../models/Sale.js";

// Helper function to calculate cost & profit
// const calculateProjectFinancials = async (projectName, revenue = 0) => {
//   const totalExpense = await Expense.aggregate([
//     { $match: { project: projectName } },
//     { $group: { _id: null, total: { $sum: "$amount" } } }
//   ]);

//   const expenseAmount = totalExpense[0]?.total || 0;

//   return {
//     totalCost: expenseAmount,
//     profit: revenue - expenseAmount
//   };
// };

const calculateProjectFinancials = async (projectName) => {

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

  return {
    totalCost: expenseAmount,
    revenue: revenueAmount,
    profit: revenueAmount - expenseAmount
  };
};

// GET all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET single project by projectId
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({ projectId: id });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// CREATE project
export const createProject = async (req, res) => {
  try {
    const { projectId, name, desc, startDate, quantity, status, revenue } = req.body;

    if (!projectId || !name || !startDate || !quantity) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const exists = await Project.findOne({ projectId });
    if (exists) {
      return res.status(400).json({ message: "Project ID already exists" });
    }

    // Calculate financials
    const financials = await calculateProjectFinancials(name, revenue || 0);

    const newProject = await Project.create({
      projectId,
      name,
      desc,
      startDate,
      quantity,
      status: status || "Planning",
      // revenue: revenue || 0,
      totalCost: financials.totalCost,
      profit: financials.profit,
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update fields
    project.name = req.body.name || project.name;
    project.desc = req.body.desc || project.desc;
    project.startDate = req.body.startDate || project.startDate;
    project.quantity = req.body.quantity || project.quantity;
    project.status = req.body.status || project.status;
    project.revenue = req.body.revenue ?? project.revenue;

    //  Recalculate financials
    const financials = await calculateProjectFinancials(
      project.name,
      // project.revenue
    );

    project.totalCost = financials.totalCost;
    project.revenue = financials.revenue;
    project.profit = financials.profit;

    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Project.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

