const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("PERN Backend Running");
});

app.get("/students", async (req, res) => {
    const result = await pool.query("SELECT * FROM students");
    res.json(result.rows);
});

app.post("/students", async (req, res) => {
    const { name, age, course } = req.body;

    const result = await pool.query(
        "INSERT INTO students (name, age, course) VALUES ($1, $2, $3) RETURNING *",
        [name, age, course]
    );

    res.json(result.rows[0]);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});