const express = require('express');
const app = express();
const path = require("path");
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const CookieParser=require('cookie-parser');
const { body, validationResult } = require('express-validator');

const secretKey='secretkey';
// Set up the view engine and static files
app.use(CookieParser());
app.use(express.static(path.join(__dirname, '../')));
app.set('views', path.join(__dirname, '../'));
app.set('view engine', 'ejs');

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

app.use(bodyParser.json());     
app.use(bodyParser.urlencoded({extended:false}));
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});


app.post('/log_in', (req, res) => {
    const { email, password } = req.body;

    // Căutare utilizator în baza de date
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Eroare de server' });
        }

        // Verifică dacă utilizatorul există
        if (results.length === 0) {
            return res.status(401).json({ message: 'Utilizatorul nu există' });
        }

        const user = results[0];
        
        // Compararea parolei introduse cu hash-ul din baza de date
        const match = await bcrypt.compare(password, user.password);
        
        if (!match) {
            return res.status(401).json({ message: 'Email sau parola sunt incorecte' });
        } else {
            const payload={
                id:user.id,
                name:user.name,
                email:user.email,
            };
            // Setează sesiunea pentru utilizatorul autentificat
            const token=jwt.sign(payload,secretKey,{expiresIn:'5d'});
            res.send(token);
            res.redirect('/');        }
    });
});
app.get('/index',(req,res)=>
{
    res.send("Login successful");
    return;
})
// Listen on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
