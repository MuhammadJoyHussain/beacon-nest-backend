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
app.use('/api/vacancy', require('./routes/vacancy'))
app.use('/api/application', require('./routes/application'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api', require('./routes/pdf'))

// Start the Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
