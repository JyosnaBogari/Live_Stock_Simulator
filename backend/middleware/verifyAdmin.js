export const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "error occurred",
      error: "Admin access only",
    });
  }

  next();
};