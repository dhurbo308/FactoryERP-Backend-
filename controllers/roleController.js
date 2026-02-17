
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