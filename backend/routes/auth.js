const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const pool = require("../config/config");
const { check, validationResult } = require("express-validator");

const router = express.Router();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use your email service, like Gmail or SendGrid
  auth: {
    user: 'hardstudy492@gmail.com',
    pass: 'kqtm ifvo bgdl komk', // Make sure to use an environment variable for security
  },
});

// Temporary storage for OTP (in production, use Redis or database)
let otpStore = {};

// Send OTP to user's email
router.post("/send-otp", [
  check("email", "Please enter a valid email").isEmail(),
], async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email format
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the email already exists
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Send OTP to the user's email
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Your OTP for Registration',
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({ message: "Failed to send OTP" });
      }

      // Store OTP temporarily (for validation during registration)
      otpStore[email] = otp;

      res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Validate OTP
    if (!otp || otp !== otpStore[email]) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP verified, remove OTP from store
    delete otpStore[email];

    res.status(200).json({ message: "OTP verified successfully, you can now register" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Register User (after OTP verification)
router.post("/register", [
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Password is required").not().isEmpty(),
], async (req, res) => {
  const { name, email, password, otp } = req.body;

  // Validate input fields
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if the email exists
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the new user in the database
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
