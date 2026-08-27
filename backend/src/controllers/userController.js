const User = require('../models/User');
const { sendJson, sendError } = require('../utils/http');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return sendError(res, 'Name, email, and password are required', 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 'User with this email already exists', 400);
    }

    const user = await User.create({ name, email, password, onboarded: true });
    
    const userObj = user.toObject();
    delete userObj.password;

    sendJson(res, { success: true, user: userObj }, 201);
  } catch (error) {
    sendError(res, error, 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const userObj = user.toObject();
    delete userObj.password;

    sendJson(res, { success: true, user: userObj });
  } catch (error) {
    sendError(res, error, 500);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return sendError(res, 'Email and new password are required', 400);
    }
    if (newPassword.length < 6) {
      return sendError(res, 'Password must be at least 6 characters', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendError(res, 'User not found with this email', 404);
    }

    user.password = newPassword;
    await user.save();

    sendJson(res, { success: true, message: 'Password reset successful' });
  } catch (error) {
    sendError(res, error, 500);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return sendError(res, 'Email is required', 400);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return sendError(res, 'User not found', 404);

    const userObj = user.toObject();
    delete userObj.password;

    sendJson(res, userObj);
  } catch (error) {
    sendError(res, error, 500);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { email, name, preferences } = req.body;
    if (!email) return sendError(res, 'Email is required to locate user', 400);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return sendError(res, 'User not found', 404);

    if (name) user.name = name.trim();
    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences
      };
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    sendJson(res, { success: true, user: userObj });
  } catch (error) {
    sendError(res, error, 500);
  }
};
