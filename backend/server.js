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
    try {
        const result = await pool.query(
            "SELECT * FROM students ORDER BY id"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/students", async (req, res) => {
    try {
        const { name, email, age, department } = req.body;

        const result = await pool.query(
            `INSERT INTO students (name, email, age, department)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [name, email, age, department]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.put("/students/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, age, department } = req.body;

        const result = await pool.query(
            `UPDATE students
             SET name = $1,
                 email = $2,
                 age = $3,
                 department = $4,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $5
             RETURNING *`,
            [name, email, age, department, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.delete("/students/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM students WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully",
            student: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});