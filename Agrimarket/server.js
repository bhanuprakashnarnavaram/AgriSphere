const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root@123",
    database: "agrimarket",
});

db.connect((err) => {
    if (err) throw err;
    console.log("✅ MySQL Connected...");
});

// Multer Configuration (for image uploads)
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// 🟢 Route: Add a new listing
app.post("/add", upload.array("images", 5), (req, res) => {
    const { name, description, price, contact, mapLink } = req.body;
    const imagePaths = req.files.map((file) => file.filename);

    const query = "INSERT INTO listings (name, description, price, contact, mapLink, images) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [name, description, price, contact, mapLink, JSON.stringify(imagePaths)], (err, result) => {
        if (err) throw err;
        res.json({ message: "Listing added successfully!", id: result.insertId });
    });
});

// 🟡 Route: Get all listings
app.get("/listings", (req, res) => {
    db.query("SELECT * FROM listings", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 🔵 Route: Get a single listing by ID
app.get("/listing/:id", (req, res) => {
    db.query("SELECT * FROM listings WHERE id = ?", [req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

// 🟠 Route: Update a listing
app.put("/update/:id", upload.array("images", 5), (req, res) => {
    const { name, description, price, contact, mapLink } = req.body;
    const imagePaths = req.files.length > 0 ? JSON.stringify(req.files.map((file) => file.filename)) : null;

    let query = "UPDATE listings SET name = ?, description = ?, price = ?, contact = ?, mapLink = ? WHERE id = ?";
    let values = [name, description, price, contact, mapLink, req.params.id];

    if (imagePaths) {
        query = "UPDATE listings SET name = ?, description = ?, price = ?, contact = ?, mapLink = ?, images = ? WHERE id = ?";
        values = [name, description, price, contact, mapLink, imagePaths, req.params.id];
    }

    db.query(query, values, (err) => {
        if (err) throw err;
        res.json({ message: "Listing updated successfully!" });
    });
});

// 🔴 Route: Delete a listing
app.delete("/delete/:id", (req, res) => {
    db.query("DELETE FROM listings WHERE id = ?", [req.params.id], (err) => {
        if (err) throw err;
        res.json({ message: "Listing deleted successfully!" });
    });
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
