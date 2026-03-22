const express = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  getAdminStats,
  getAdminLogs,
  exportUsersCsv,
} = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorizeRoles("admin"));
router.get("/admin/stats", getAdminStats);
router.get("/admin/logs", getAdminLogs);
router.get("/users", getUsers);
router.get("/users/export", exportUsersCsv);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/reset-password", resetUserPassword);

module.exports = router;
