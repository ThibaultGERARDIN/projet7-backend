const express = require('express')
const mongoose = require('mongoose')
const bookRoutes = require('./routes/book.js')
const userRoutes = require('./routes/user.js')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const path = require('path')
require('dotenv').config()

const app = express()

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_ACCESS}@cluster0.8c0spdi.mongodb.net/Project7`,
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  )
  next()
})

app.use(mongoSanitize())
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
)

app.use(express.json())
app.use('/api/books', bookRoutes)
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app
