const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @desc   Register new user
 * @route  POST /api/auth/signup
 */
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role = "member" } = req.body;

    // 🔎 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // 🎟️ Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ❌ Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userObj
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/**
 * @desc   Login user
 * @route  POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔎 Find user (include password)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🎟️ Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ❌ Remove password
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userObj
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};