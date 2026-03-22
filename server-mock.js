import express from 'express';
import cors from 'cors';

// Simple JWT mock
const jwt = {
  sign: (payload, secret, options) => 'mock-token-' + Date.now()
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock users data
const users = [
  { _id: '1', name: 'Admin User', email: 'admin@123', role: 'admin', password: 'admin123' },
  { _id: '2', name: 'Regular User', email: 'user@123', role: 'user', password: 'user123' }
];

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, 'demo-secret', { expiresIn: '1h' });
    res.json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Get users (admin only)
app.get('/api/users', (req, res) => {
  res.json({
    users: users.map(u => ({ ...u, password: undefined })),
    total: users.length,
    page: 1,
    limit: 10,
    totalPages: 1
  });
});

// Other mock endpoints
app.post('/api/users', (req, res) => {
  const newUser = { ...req.body, _id: Date.now().toString() };
  users.push(newUser);
  res.json({ ...newUser, password: undefined });
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u._id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    res.json({ ...users[index], password: undefined });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(u => u._id === id);
  if (index !== -1) {
    users.splice(index, 1);
    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalUsers: users.length,
    adminUsers: users.filter(u => u.role === 'admin').length,
    regularUsers: users.filter(u => u.role === 'user').length
  });
});

app.get('/api/admin/logs', (req, res) => {
  res.json({
    logs: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });
});

app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
});
