
// import Role from "../models/Role.js";

// // GET all roles
// export const getRoles = async (req, res) => {
//   try {
//     const roles = await Role.find().sort({ createdAt: -1 });
//     res.json(roles);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // CREATE role (admin)
// export const createRole = async (req, res) => {
//   try {
//     const { name, permissions } = req.body;

//     if (!name) {
//       return res.status(400).json({ message: "Role name required" });
//     }

//     const exists = await Role.findOne({ name: name.toLowerCase() });

//     if (exists) {
//       return res.status(400).json({ message: "Role already exists" });
//     }

//     const role = await Role.create({
//       name: name.toLowerCase(),
//       permissions: permissions || {},
//     });

//     res.status(201).json(role);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // UPDATE role permissions (admin)
// export const updateRolePermissions = async (req, res) => {
//   try {
//     const { roleName } = req.params;
//     const { permissions } = req.body;

//     const role = await Role.findOne({ name: roleName.toLowerCase() });

//     if (!role) {
//       return res.status(404).json({ message: "Role not found" });
//     }

//     role.permissions = {
//       ...role.permissions,
//       ...permissions,
//     };

//     await role.save();

//     res.json({ message: "Role permissions updated", role });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import Role from "../models/Role.js";
import User from "../models/User.js";

// GET all roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE role permissions
export const updateRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const role = await Role.findById(id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    role.permissions = permissions;
    await role.save();

    res.json({ message: "Role permissions updated", role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE role (admin)
export const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Role name required" });
    }

    const exists = await Role.findOne({ name: name.toLowerCase() });

    if (exists) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = await Role.create({
      name: name.toLowerCase(),
      permissions: permissions || {},
    });

    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ROLE NAME
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Prevent renaming admin
    if (role.name === "admin") {
      return res.status(403).json({ message: "Admin role cannot be renamed" });
    }

    role.name = name.toLowerCase();
    role.description = description || role.description;

    await role.save();

    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Prevent deleting admin role
    if (role.name === "admin") {
      return res.status(403).json({ message: "Admin role cannot be deleted" });
    }

    // Prevent deleting role if assigned to users
    const usersWithRole = await User.findOne({ role: role.name });
    if (usersWithRole) {
      return res.status(400).json({
        message: "Role is assigned to users. Reassign users first.",
      });
    }

    await role.deleteOne();

    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};