export const checkPermission = (moduleName) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Admin always allowed
    if (req.user.role === "admin") return next();

    const allowed = req.user.permissions?.[moduleName];

    if (!allowed) {
      return res.status(403).json({
        message: `Access denied. No permission for ${moduleName}`,
      });
    }

    next();
  };
};
