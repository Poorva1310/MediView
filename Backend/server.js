const express = require('express'); // Web framework to handle routes
const cors = require('cors'); // Allow frontend to send requests
const bodyParser = require('body-parser'); // To parse form data
const database = require('./db'); // MySQL connection
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 4000; // Default to 4000 if not set

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ✅ Fix: Ensure MySQL connection works
database.connect((error) => {
    if (error) {
        console.error("Database connection failed:", error);
    } else {
        console.log("✅ MySQL Database is connected...");
    }
});




// Signup Route
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

    database.query(sql, [username, email, password], (err, result) => {
        if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ message: "Registration Failed" });
        }
        res.json({ message: "Registration Successful" });
    });
});

// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ?";

    database.query(sql, [username], (err, results) => {
        if (err) {
            console.error("Error checking user:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        if (results.length === 0 || results[0].password !== password) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        res.json({ message: "Login successful!", userId: results[0].id });
    });
});

// Contact Form Route
app.post('/contact', (req, res) => {
    const { full_name, email, message } = req.body;
    const sql = "INSERT INTO contactmessages (full_name, email, message) VALUES (?, ?, ?)";

    database.query(sql, [full_name, email, message], (err, result) => {
        if (err) {
            console.error("Error saving contact message:", err);
            return res.status(500).json({ message: "Failed to send message" });
        }
        res.json({ message: "Message sent successfully!" });
    });
});

// ✅ Start the server properly
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
