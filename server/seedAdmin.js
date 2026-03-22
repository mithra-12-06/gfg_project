const User = require("./models/User");

const seedDefaultAdmin = async () => {
  const defaultAccounts = [
    {
      name: "Default User",
      email: "user@123",
      password: "user123",
      role: "user",
    },
    {
      name: "System Admin",
      email: "admin@123",
      password: "admin123",
      role: "admin",
    },
  ];

  for (const account of defaultAccounts) {
    const existingUser = await User.findOne({ email: account.email });

    if (!existingUser) {
      await User.create(account);
      console.log(`Default ${account.role} created`);
      continue;
    }

    existingUser.name = account.name;
    existingUser.role = account.role;
    existingUser.password = account.password;
    await existingUser.save();
  }
};

module.exports = seedDefaultAdmin;
