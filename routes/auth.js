const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });

    // تأكد إن الـ email مش موجود
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: 'Email already exists' });

    // شفّر الـ password
    const hashed = await bcrypt.hash(password, 10);

    // احفظ الـ user
    const user = await User.create({ name, email, password: hashed });

    // عمل token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({ message: 'Registered!', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'All fields are required' });

    // جيب الـ user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: 'Invalid credentials' });

    // قارن الـ password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: 'Invalid credentials' });

    // عمل token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(200).json({ message: 'Logged in!', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;