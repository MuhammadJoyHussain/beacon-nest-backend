const mongoose = require('mongoose')

let isConnected = false

const connectDB = async () => {
  if (isConnected) {
    return
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {})
    isConnected = db.connections[0].readyState === 1
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err.message)
    throw err // let Vercel log the error
  }
}

module.exports = connectDB
