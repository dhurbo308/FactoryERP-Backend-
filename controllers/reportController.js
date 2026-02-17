import Expense from "../models/Expense.js";
import Supplier from "../models/Supplier.js";
import Project from "../models/Project.js";
import SalaryBill from "../models/SalaryBill.js"; // (we will create model)
import Payment from "../models/Payment.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

const buildDateFilter = (req) => {
  const { from, to } = req.query;

  if (!from || !to) return {};

  return {
    date: {
      $gte: new Date(from),
      $lte: new Date(to),
    },
  };
};

// ==========================
// Project Cost Report
// ==========================
// export const projectCostReport = async (req, res) => {
//   try {
//     const dateFilter = buildDateFilter(req);
//     const projects = await Project.find();

//     const report = await Promise.all(
//       projects.map(async (p) => {
//         const totalExpense = await Expense.aggregate([
//           { $match: dateFilter },
//           { $match: { project: p.name } },
//           { $group: { _id: null, total: { $sum: "$amount" } } },
//         ]);

//         const cost = totalExpense[0]?.total || 0;
//         const revenue = p.revenue || 0;
//         const profit = revenue - cost;

//         return {
//           name: p.name,
//           cost,
//           revenue,
//           profit,
//         };
//       })
//     );

//     res.json(report);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const projectCostReport = async (req, res) => {
  try {
    const dateFilter = buildDateFilter(req);

    const projects = await Project.find();

    const report = await Promise.all(
      projects.map(async (p) => {

        // ✅ Total Expense for project
        const expenseAgg = await Expense.aggregate([
          { $match: dateFilter },
          { $match: { project: p.name } },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]);

        const cost = expenseAgg[0]?.total || 0;

        // ✅ Total Revenue from payments for project
        const revenueAgg = await Payment.aggregate([
          { $match: dateFilter },
          { $match: { project: p.name } },
          {
            $group: {
              _id: null,
              total: { $sum: "$paidAmount" },
            },
          },
        ]);

        const revenue = revenueAgg[0]?.total || 0;

        const profit = revenue - cost;

        return {
          name: p.name,
          cost,
          revenue,
          profit,
        };
      })
    );

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// Supplier Due Report
// ==========================
export const supplierDueReport = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// Monthly Expense Report
// ==========================
export const monthlyExpenseReport = async (req, res) => {
  try {

    const dateFilter = buildDateFilter(req);

    const monthlyExpense = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] }, // YYYY-MM
          expense: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = monthlyExpense.map((m) => ({
      month: m._id,
      expense: m.expense,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// Category-wise Expense Report
// ==========================
export const categoryExpenseReport = async (req, res) => {
  try {
    const dateFilter = buildDateFilter(req);

    const categoryExpense = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { amount: -1 } },
    ]);

    const formatted = categoryExpense.map((c) => ({
      category: c._id,
      amount: c.amount,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================
// Profit Loss Report
// ==========================
// export const profitLossReport = async (req, res) => {
//   try {
//     const dateFilter = buildDateFilter(req);
//     const totalRevenueAgg = await Project.aggregate([
//       { $match: dateFilter },
//       {
//         $group: {
//           _id: null,
//           revenue: { $sum: "$revenue" },
//         },
//       },
//     ]);

//     const revenue = totalRevenueAgg[0]?.revenue || 0;

//     // Expenses (Project Expenses + Salary Bills)
//     const totalExpenseAgg = await Expense.aggregate([
//       { $group: { _id: "$category", amount: { $sum: "$amount" } } },
//     ]);

//     const salaryAgg = await SalaryBill.aggregate([
//       { $group: { _id: "$category", amount: { $sum: "$amount" } } },
//     ]);

//     // merge both expense lists
//     const expenseMap = {};

//     totalExpenseAgg.forEach((e) => {
//       expenseMap[e._id] = (expenseMap[e._id] || 0) + e.amount;
//     });

//     salaryAgg.forEach((s) => {
//       expenseMap[s._id] = (expenseMap[s._id] || 0) + s.amount;
//     });

//     const expenses = Object.keys(expenseMap).map((key) => ({
//       label: key,
//       amount: expenseMap[key],
//     }));

//     res.json({ revenue, expenses });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const profitLossReport = async (req, res) => {
  try {
    const dateFilter = buildDateFilter(req);

    // Total Revenue = sum of payments (income)
    const revenueAgg = await Payment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$paidAmount" },
        },
      },
    ]);

    const revenue = revenueAgg[0]?.revenue || 0;

    // Expenses
    const expenseAgg = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
        },
      },
    ]);

    const salaryAgg = await SalaryBill.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
        },
      },
    ]);

    // Merge expense + salary
    const expenseMap = {};

    expenseAgg.forEach((e) => {
      expenseMap[e._id] = (expenseMap[e._id] || 0) + e.amount;
    });

    salaryAgg.forEach((s) => {
      expenseMap[s._id] = (expenseMap[s._id] || 0) + s.amount;
    });

    const expenses = Object.keys(expenseMap).map((key) => ({
      label: key,
      amount: expenseMap[key],
    }));

    res.json({ revenue, expenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const exportPDF = async (req, res) => {
  try {
    const expenses = await Expense.find();

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(20).text("Business Expense Report", { align: "center" });
    doc.moveDown();

    expenses.forEach((e) => {
      doc
        .fontSize(12)
        .text(
          `${e.date} | ${e.project} | ${e.category} | ৳${e.amount}`
        );
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportExcel = async (req, res) => {
  try {
    const expenses = await Expense.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Expense Report");

    worksheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Project", key: "project", width: 25 },
      { header: "Category", key: "category", width: 20 },
      { header: "Amount", key: "amount", width: 15 },
    ];

    expenses.forEach((e) => {
      worksheet.addRow({
        date: e.date,
        project: e.project,
        category: e.category,
        amount: e.amount,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};