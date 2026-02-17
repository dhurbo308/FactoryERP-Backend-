// export const checkPermission = (moduleName) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     // Admin always allowed
//     if (req.user.role === "admin") return next();

//     const allowed = req.user.permissions?.[moduleName];

//     if (!allowed) {
//       return res.status(403).json({
//         message: `Access denied. No permission for ${moduleName}`,
//       });
//     }

//     next();
//   };
// };

import Role from "../models/Role.js";

export const checkPermission = (moduleName) => {
  return async (req, res, next) => {
    try {
      const role = await Role.findOne({
        name: new RegExp("^" + req.user.role + "$", "i"),
      });

      if (!role) {
        return res.status(403).json({ message: "Role not found" });
      }

      if (!role.permissions[moduleName]) {
        return res.status(403).json({
          message: `Access denied: No permission for ${moduleName}`,
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};
