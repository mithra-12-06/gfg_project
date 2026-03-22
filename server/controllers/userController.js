const User = require("../models/User");
const AdminLog = require("../models/AdminLog");

const writeAdminLog = async ({ action, performedBy, targetUserId = null, targetEmail = "", meta = "" }) => {
  await AdminLog.create({
    action,
    performedBy,
    targetUserId,
    targetEmail,
    meta,
  });
};

const getUsers = async (req, res) => {
  try {
    const { search = "", role = "all", page = 1, limit = 10, sort = "recent" } = req.query;
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (currentPage - 1) * pageSize;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role === "user" || role === "admin") {
      filter.role = role;
    }

    const sortMap = {
      recent: { lastLogin: -1, createdAt: -1 },
      oldest: { createdAt: 1 },
      name_asc: { name: 1 },
      name_desc: { name: -1 },
    };
    const sortQuery = sortMap[sort] || sortMap.recent;

    const [users, total] = await Promise.all([
      User.find(filter).select("-password").sort(sortQuery).skip(skip).limit(pageSize),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      users,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
    });

    await writeAdminLog({
      action: "USER_CREATED",
      performedBy: req.user._id,
      targetUserId: user._id,
      targetEmail: user.email,
      meta: `Created with role ${user.role}`,
    });

    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create user" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(409).json({ message: "Email already exists" });
      }
    }

    const prevRole = user.role;

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (role && role !== user.role) {
      if (user.role === "admin" && role === "user") {
        const adminCount = await User.countDocuments({ role: "admin" });
        if (adminCount <= 1) {
          return res.status(400).json({ message: "Cannot demote the last admin" });
        }
      }
      user.role = role;
    }
    if (password) user.password = password;

    await user.save();

    await writeAdminLog({
      action: "USER_UPDATED",
      performedBy: req.user._id,
      targetUserId: user._id,
      targetEmail: user.email,
      meta: prevRole !== user.role ? `Role changed ${prevRole} -> ${user.role}` : "Profile updated",
    });

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({ message: "Cannot delete the last admin" });
      }
    }

    const deletedEmail = user.email;
    await user.deleteOne();
    await writeAdminLog({
      action: "USER_DELETED",
      performedBy: req.user._id,
      targetUserId: user._id,
      targetEmail: deletedEmail,
    });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

const resetUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPassword = (password || "password123").trim();
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    user.password = newPassword;
    await user.save();

    await writeAdminLog({
      action: "PASSWORD_RESET",
      performedBy: req.user._id,
      targetUserId: user._id,
      targetEmail: user.email,
    });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to reset password" });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const now = new Date();
    const last30 = new Date();
    last30.setDate(now.getDate() - 29);
    last30.setHours(0, 0, 0, 0);

    const [totalUsers, adminCount, activeUsers, roleDistributionAgg, registrationsAgg] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ lastLogin: { $gte: last30 } }),
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
      User.aggregate([
        { $match: { createdAt: { $gte: last30 } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ]),
    ]);

    const roleDistribution = roleDistributionAgg.map((entry) => ({
      role: entry._id,
      count: entry.count,
    }));

    const registrationsByDateMap = new Map();
    for (let i = 0; i < 30; i += 1) {
      const date = new Date(last30);
      date.setDate(last30.getDate() + i);
      const key = date.toISOString().slice(0, 10);
      registrationsByDateMap.set(key, 0);
    }

    registrationsAgg.forEach((entry) => {
      const key = `${entry._id.year}-${String(entry._id.month).padStart(2, "0")}-${String(entry._id.day).padStart(2, "0")}`;
      registrationsByDateMap.set(key, entry.count);
    });

    const registrationsTrend = Array.from(registrationsByDateMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    return res.status(200).json({
      cards: {
        totalUsers,
        activeUsers,
        adminCount,
      },
      registrationsTrend,
      roleDistribution,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load admin stats" });
  }
};

const getAdminLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (currentPage - 1) * pageSize;

    const [logs, total] = await Promise.all([
      AdminLog.find()
        .populate("performedBy", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      AdminLog.countDocuments(),
    ]);

    return res.status(200).json({
      logs,
      pagination: {
        page: currentPage,
        limit: pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load admin logs" });
  }
};

const exportUsersCsv = async (req, res) => {
  try {
    const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 });
    const rows = [
      ["name", "email", "role", "created_at"].join(","),
      ...users.map((user) =>
        [
          `"${(user.name || "").replace(/"/g, '""')}"`,
          `"${(user.email || "").replace(/"/g, '""')}"`,
          `"${user.role}"`,
          `"${user.createdAt ? new Date(user.createdAt).toISOString() : ""}"`,
        ].join(",")
      ),
    ];

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="users-export.csv"');
    return res.status(200).send(rows.join("\n"));
  } catch (error) {
    return res.status(500).json({ message: "Failed to export users" });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  getAdminStats,
  getAdminLogs,
  exportUsersCsv,
};
