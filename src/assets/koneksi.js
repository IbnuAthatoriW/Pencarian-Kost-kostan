const mysql = require("mysql2");
const dotenv = require("dotenv");

// Memuat variabel lingkungan dari file .env
dotenv.config();

// Konfigurasi koneksi ke database
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "kost",
});

// Menghubungkan ke database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1);
  } else {
    console.log("Successfully connected to the database.");
  }
});

module.exports = db;
