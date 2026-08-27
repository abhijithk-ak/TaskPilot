const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: 1000,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['todo', 'progress', 'done'],
      default: 'todo',
    },
    dueDate: {
      type: Date,
      required: false,
    },
    category: {
      type: String,
      enum: ['work', 'personal', 'health', 'learning', 'finance', 'urgent', 'other', ''],
      default: '',
      required: false,
    },
    tags: {
      type: [String],
      default: [],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);