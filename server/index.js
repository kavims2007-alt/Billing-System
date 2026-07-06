const express = require("express");
const cors = require("cors");
const db = require("./db");
const app = express();

app.use(cors());
app.use(express.json());
app.post("/register", (req, res) => {
  const { full_name, email, mobile, password } = req.body;

  const sql =
    "INSERT INTO users (full_name, email, mobile, password) VALUES (?, ?, ?, ?)";

  db.query(sql, [full_name, email, mobile, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Registration Failed",
      });
    }

    res.json({
      message: "Registration Successful",
    });
  });
});
app.get("/", (req, res) => {
  res.send("Billing Software Backend Running...");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server running on http://localhost:5000");
});