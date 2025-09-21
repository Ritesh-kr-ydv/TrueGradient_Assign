const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
const corsOptions = {
  origin: ['http://localhost:3000','https://truegradient-assign-5.onrender.com'], // Your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  credentials: true, // Allow cookies/headers
};
app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
// app.use 

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/truegradient')
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

module.exports = app;
