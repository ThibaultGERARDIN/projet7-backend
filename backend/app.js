const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bookRoutes = require('./routes/book.js')
const userRoutes = require('./routes/user.js')
const path = require('path')

const app = express()

mongoose
  .connect(
    'mongodb+srv://Karadrui:Papuche050816@cluster0.8c0spdi.mongodb.net/',
    { useNewUrlParser: true, useUnifiedTopology: true },
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use(express.json())

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
app.use('/api/books', bookRoutes)
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app
