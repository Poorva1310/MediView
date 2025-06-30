const mysql = require('mysql2');
require('dotenv').config();

// Create a connection to MySQL
const database = mysql.createConnection({
    host: process.env.DB_HOST,  
    user: process.env.DB_USER,  
    password: process.env.DB_PASS,  
    database: process.env.DB_NAME  
});


// Connect to MySQL
database.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL Database!");
});

module.exports = database;
