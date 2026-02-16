import User from "../models/User.js";
import Role from "../models/Role.js";

// GET all users with permissions
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    const usersWithPermissions = await Promise.all(
      users.map(async (u) => {
        const role = await Role.findOne({ name: u.role });

        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          permissions: role?.permissions || {},
          createdAt: u.createdAt,
        };
      })
    );

    res.json(usersWithPermissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE user role (admin)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const roleExists = await Role.findOne({ name: role.toLowerCase() });

    if (!roleExists) {
      return res.status(400).json({ message: "Role does not exist" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role.toLowerCase();
    await user.save();

    res.json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
