const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const Router = require('./router');
const { parseBody, sendJson, sendError, handleCors } = require('./utils/http');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ Mongo error:', err));

// Initialize router
const router = new Router();

// Import controllers
const taskController = require('./controllers/taskController');
const userController = require('./controllers/userController');

// User / Auth Routes
router.post('/auth/register', async (req, res) => {
  try {
    req.body = await parseBody(req);
    await userController.register(req, res);
  } catch (error) {
    sendError(res, error, 400);
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    req.body = await parseBody(req);
    await userController.login(req, res);
  } catch (error) {
    sendError(res, error, 400);
  }
});

router.post('/auth/reset-password', async (req, res) => {
  try {
    req.body = await parseBody(req);
    await userController.resetPassword(req, res);
  } catch (error) {
    sendError(res, error, 400);
  }
});

router.get('/auth/profile', async (req, res) => {
  try {
    await userController.getProfile(req, res);
  } catch (error) {
    sendError(res, error, 500);
  }
});

router.put('/auth/profile', async (req, res) => {
  try {
    req.body = await parseBody(req);
    await userController.updateProfile(req, res);
  } catch (error) {
    sendError(res, error, 400);
  }
});

// Task Routes
router.post('/tasks', async (req, res) => {
  try {
    req.body = await parseBody(req);
    await taskController.createTask(req, res);
  } catch (error) {
    sendError(res, error, 400);
  }
});

router.get('/tasks', async (req, res) => {
  try {
    await taskController.getTasks(req, res);
  } catch (error) {
    sendError(res, error, 500);
  }
});

router.get('/tasks/:id', async (req, res) => {
  try {
    await taskController.getTaskById(req, res);
  } catch (error) {
    sendError(res, error, 500);
  }
});

router.put('/tasks/:id', async (req, res) => {
  try {
    req.body = await parseBody(req);
    await taskController.updateTask(req, res);
  } catch (error) {
    sendError(res, error, 400);
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    await taskController.deleteTask(req, res);
  } catch (error) {
    sendError(res, error, 500);
  }
});

router.post('/tasks/classify', async (req, res) => {
  try {
    req.body = await parseBody(req);
    await taskController.classifyTask(req, res);
  } catch (error) {
    sendError(res, error, 500);
  }
});

// Health check
router.get('/health', async (req, res) => {
  sendJson(res, { status: 'healthy', service: 'TaskPilot Backend' });
});

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (handleCors(req, res)) return;

  // Route the request
  await router.handle(req, res);
});

module.exports = server;