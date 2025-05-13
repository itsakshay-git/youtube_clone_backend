import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Registers a new user with avatar, hashed password, and full name.
 *
 * @async
 * @function register
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body containing firstname, lastname, email, and password.
 * @param {Object} req.file - Uploaded file object for the avatar.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Responds with status 201 on success or 500 on error.
 */

export const register = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const avatar = req.file?.path;

    if (!avatar)
      return res.status(400).json({ message: "Avatar upload failed" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: `${firstname} ${lastname}`,
      email,
      password: hashedPassword,
      avatar,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Registration error", error: err.message });
  }
};

/**
 * Logs in a user by verifying email and password, then returns a token and profile.
 *
 * @async
 * @function login
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Contains email and password.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Responds with JWT token and user profile, or error message.
 */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Find user by email
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Step 2: Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Step 3: Get full profile
    const fullProfile = await User.getFullProfile(user._id);

    // Step 4: Return token + full profile
    res.json({ token, user: fullProfile });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

/**
 * Fetches the current authenticated user's full profile using the ID from the JWT.
 *
 * @async
 * @function getCurrentUser
 * @param {Object} req - Express request object with user injected by middleware.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Returns user data or 404 if not found.
 */

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.getFullProfile(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Checks if an email is already registered.
 *
 * @async
 * @function checkEmail
 * @param {Object} req - Express request object.
 * @param {string} req.query.email - The email to check for existence.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Returns an object with `exists: true|false`.
 */

export const checkEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ exists: false });

  const user = await User.findOne({ email });
  return res.json({ exists: !!user });
};

/**
 * Resets a user's password by hashing a new one based on their email.
 *
 * @async
 * @function forgetPassword
 * @param {Object} req - Express request object.
 * @param {string} req.body.email - User's email.
 * @param {string} req.body.newPassword - New password to be set.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Returns a success message or error.
 */

export const forgetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Email not found" });

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();
  return res.json({ message: "Password updated" });
};
