const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

const MONGO_URI = 'mongodb://127.0.0.1:27017/mern-auth';

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

console.log('Connecting to MongoDB:', MONGO_URI);
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(' MongoDB error:', err.message));

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 587,
  auth: {
    user: 'resend',
    pass: 're_DKx2seVx_FkTYZad1HZR7qY81TVaDWdcC', 
  },
});


app.post('/api/send-otp', async (req, res) => {
  const { email, username, password } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) return res.status(400).json({ error: 'User already exists' });

  const existingOtp = otpStore.get(email);
  if (existingOtp && Date.now() - existingOtp.createdAt < 60 * 1000) {
    return res.status(429).json({ error: 'Please wait before requesting a new OTP' });
  }

  const otp = generateOTP();
  otpStore.set(email, { otp, username, password, createdAt: Date.now() });

  try {
    await transporter.sendMail({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Failed to send OTP:', err.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const stored = otpStore.get(email);
  if (!stored || stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  if (Date.now() - stored.createdAt > 5 * 60 * 1000) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP expired' });
  }

  const hashedPassword = await bcrypt.hash(stored.password, 10);
  const user = new User({
    email,
    username: stored.username,
    password: hashedPassword,
  });

  await user.save();
  otpStore.delete(email);
  res.json({ message: 'Registration successful' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
  res.json({ token });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
