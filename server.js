import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

import { handler } from './build/handler.js'; // หลังจาก build แล้ว

const app = express();
app.use(cors({
    origin: 'https://urgent-anthia-pyephebes0-bdb76743.koyeb.app',
    credentials: true
}));
app.use(express.json());
app.use(express.static('static'));

const mongoUri = 'mongodb+srv://xyz928msnladyboy:9U7MoU6J27ZIw1WE@pyephebes.4sn4j.mongodb.net/msnladyboy';
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));;

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    passwordHash: String
});
const User = mongoose.model('User', UserSchema);

const PostSchema = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    title: String,
    content: String,
    createdAt: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', PostSchema);

const JWT_SECRET = 'your_secret_key';

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, passwordHash });
    await user.save();
    res.json({ message: 'User registered' });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true, // ใช้ true เมื่อ deploy (HTTPS)
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ message: 'Login successful' });
});

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'No token provided' });
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (err) {
      res.status(403).json({ error: 'Invalid token' });
    }
  };
  

app.post('/posts', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    const post = new Post({ title, content, userId: req.user.userId });
    await post.save();
    res.json(post);
});

app.get('/posts', async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
});

app.get('/search', async (req, res) => {
    const { q } = req.query;
    const posts = await Post.find({ title: { $regex: q, $options: 'i' } });
    res.json(posts);
});

// Profile route (protected)
app.get('/profile', authMiddleware, async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ username: user.username, email: user.email });
  });

app.use(handler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
