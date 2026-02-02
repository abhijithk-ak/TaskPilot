const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskpilot')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/tasks', require('./routes/taskRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'TaskPilot Backend' });
});

module.exports = app;