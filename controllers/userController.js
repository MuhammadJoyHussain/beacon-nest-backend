const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

// Register User
exports.registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    dob,
    gender,
    email,
    phone,
    street,
    city,
    postcode,
    country,
    department,
    position,
    startDate,
    username,
    password,
    confirmPassword,
    shareCode,
    terms,
    gdpr,
  } = req.body

  try {
    // Check if user already exists by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with email or username already exists' })
    }

    // Password match validation
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      dob,
      gender,
      email,
      phone,
      street,
      city,
      postcode,
      country,
      department,
      position,
      startDate,
      username,
      password, // This will be hashed via the pre-save hook
      shareCode,
      terms,
      gdpr,
    })

    // Respond with token and basic info
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id), // Assumes you're using JWT
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server Error. Try again later.' })
  }
}

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
