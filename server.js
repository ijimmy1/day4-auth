const express = require('express');
const mongoose = require('mongoose');
const protect = require('./middleware/protect');
require('dotenv').config();

const app = express();
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));

// Route محمية — محتاج token عشان توصلها
app.get('/profile', protect, (req, res) => {
  res.status(200).json({ message: 'Welcome!', user: req.user });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB ✅');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));