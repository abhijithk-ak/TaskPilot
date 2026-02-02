const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: false,
      trim: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['todo', 'progress', 'done'],
      default: 'todo'
    },
    dueDate: {
      type: Date,
      required: false
    }
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model('Task', taskSchema);