const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST','PUT', 'DELETE'], 
    credentials: true,           
  };

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mern-auth', {
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ 
            username, 
            password: hashedPassword 
        });
        await user.save();
        console.log(user)
        res.json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(400).json({ error: 'Username already exists' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign('secretkey', { expiresIn: '1h' });
    res.cookie('token',token)
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
