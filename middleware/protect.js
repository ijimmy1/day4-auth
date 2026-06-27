const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // جيب الـ token من الـ header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token)
      return res.status(401).json({ error: 'No token, access denied' });

    // تحقق من الـ token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // حط بيانات الـ user في الـ request
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = protect;