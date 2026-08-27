const Task = require('../models/Task');
const axios = require('axios');
const { sendJson, sendError } = require('../utils/http');

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    sendJson(res, task, 201);
  } catch (error) {
    sendError(res, error, 400);
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { userEmail } = req.query;
    const filter = userEmail ? { userEmail } : {};
    const tasks = await Task.find(filter);
    sendJson(res, tasks);
  } catch (error) {
    sendError(res, error, 500);
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return sendError(res, 'Task not found', 404);
    }
    sendJson(res, task);
  } catch (error) {
    sendError(res, error, 500);
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true
    });
    if (!task) {
      return sendError(res, 'Task not found', 404);
    }
    sendJson(res, task);
  } catch (error) {
    sendError(res, error, 400);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return sendError(res, 'Task not found', 404);
    }
    sendJson(res, { message: 'Task deleted successfully' });
  } catch (error) {
    sendError(res, error, 500);
  }
};

exports.classifyTask = async (req, res) => {
  try {
    const response = await axios.post('http://localhost:8000/predict', {
      description: req.body.description
    });
    sendJson(res, response.data);
  } catch (error) {
    sendError(res, { error: 'AI service unavailable', details: error.message }, 500);
  }
};