import fs from "fs-extra";
import path from "path";

import User from "../models/User.js";
import Supplier from "../models/Supplier.js";
import Project from "../models/Project.js";
import Expense from "../models/Expense.js";
import Payment from "../models/Payment.js";

export const createBackup = async (req, res) => {
  try {
    const backupData = {
      createdAt: new Date(),
      users: await User.find(),
      suppliers: await Supplier.find(),
      projects: await Project.find(),
      expenses: await Expense.find(),
      payments: await Payment.find(),
    };

    const backupDir = path.join(process.cwd(), "backups");
    await fs.ensureDir(backupDir);

    const fileName = `backup-${Date.now()}.json`;
    const filePath = path.join(backupDir, fileName);

    await fs.writeJson(filePath, backupData, { spaces: 2 });

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const restoreBackup = async (req, res) => {
  try {
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({ message: "Backup filename required" });
    }

    const backupDir = path.join(process.cwd(), "backups");
    const filePath = path.join(backupDir, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Backup file not found" });
    }

    const data = await fs.readJson(filePath);

    // ⚠️ Clear DB first
    await User.deleteMany();
    await Supplier.deleteMany();
    await Project.deleteMany();
    await Expense.deleteMany();
    await Payment.deleteMany();

    // Restore data
    await User.insertMany(data.users);
    await Supplier.insertMany(data.suppliers);
    await Project.insertMany(data.projects);
    await Expense.insertMany(data.expenses);
    await Payment.insertMany(data.payments);

    res.json({ message: "Database restored successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listBackups = async (req, res) => {
  try {
    const backupDir = path.join(process.cwd(), "backups");
    await fs.ensureDir(backupDir);

    const files = await fs.readdir(backupDir);

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
