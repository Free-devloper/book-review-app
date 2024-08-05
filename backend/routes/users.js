const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

const ACCESS_TOKEN_SECRET = 'HopeItworks';
const REFRESH_TOKEN_SECRET = 'GoodGetGoint';
const REFRESH_TOKEN_EXPIRY = '7d'; // Refresh token expiry time

const tokens = [];

// Generate access token
function generateAccessToken(user) {
  return jwt.sign({ userId: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

// Generate refresh token
function generateRefreshToken(user) {
  const refreshToken = jwt.sign({ userId: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  tokens.push(refreshToken);
  return refreshToken;
}

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.json({ accessToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Refresh token
router.post('/token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken || !tokens.includes(refreshToken)) {
    return res.status(403).json({ error: 'Access denied, no refresh token provided' });
  }

  try {
    const user = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

module.exports = router;
