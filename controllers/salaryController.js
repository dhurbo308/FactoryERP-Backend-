import Salary from "../models/Salary.js";

export const getSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find().sort({ createdAt: -1 });
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSalary = async (req, res) => {
  try {
    const { billId, month, category, type, amount, status } = req.body;

    const exists = await Salary.findOne({ billId });
    if (exists) {
      return res.status(400).json({ message: "Bill ID already exists" });
    }

    const salary = await Salary.create({
      billId,
      month,
      category,
      type,
      amount,
      status,
    });

    res.status(201).json(salary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSalary = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Salary.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSalary = async (req, res) => {
  try {
    const { id } = req.params;

    await Salary.findByIdAndDelete(id);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
