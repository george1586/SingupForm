const express = require('express');
const app = express();
const path = require("path");
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

const JWT_SECRET = 'your_jwt_secret';  // Replace with a strong, random secret

// Set up the view engine and static files
app.use(express.static(path.join(__dirname, '../')));
app.set('views', path.join(__dirname, '../'));
app.set('view engine', 'ejs');

// Middleware for parsing JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// MySQL Database connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1306',
    database: 'user_database',
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to mate10 database!");
});

// Route to render index.ejs
app.get("/", (req, res) => {
    res.render('index');
});

// User registration route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.query(query, [username, email, hashedPassword], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// User login route with JWT
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
                res.cookie('token', token, { httpOnly: true });  // Send token as HTTP-only cookie
                res.json({ message: 'Login successful!' });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });
});

// JWT middleware for protected routes
function jwtAuthMiddleware(req, res, next) {
    const token = req.cookies.token;  // Retrieve token from cookie
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.userId = decoded.id;  // Store user ID in req
        next();
    });
}

// Protected route example
app.get('/dashboard', jwtAuthMiddleware, (req, res) => {
    res.send('Welcome to your dashboard');
});


// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
