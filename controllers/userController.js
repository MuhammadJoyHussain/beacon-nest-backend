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

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id) // req.user.id comes from JWT middleware

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const { phone, street, city, postcode, country, shareCode } = req.body

    // Only update allowed fields
    if (phone) user.phone = phone
    if (street) user.street = street
    if (city) user.city = city
    if (postcode) user.postcode = postcode
    if (country) user.country = country
    if (shareCode) user.shareCode = shareCode

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      phone: updatedUser.phone,
      street: updatedUser.street,
      city: updatedUser.city,
      postcode: updatedUser.postcode,
      country: updatedUser.country,
      shareCode: updatedUser.shareCode,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
