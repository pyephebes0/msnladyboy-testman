import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

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
    res.json({ token });
});

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload; // ตั้งค่า userId ที่ได้จาก token
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}


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
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            username: user.username,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to load profile' });
    }
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));
