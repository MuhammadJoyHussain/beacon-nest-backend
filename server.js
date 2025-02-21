const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')

dotenv.config()
const app = express()

// Middleware
app.use(express.json())
app.use(cors())
connectDB()

// Routes
app.use('/api/candidate', require('./routes/candidate'))

// Start the Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
