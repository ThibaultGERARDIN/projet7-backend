const bcrypt = require('bcrypt')
const User = require('../models/User')
const jwt = require('jsonwebtoken')


// Fonction de création d'un utilisateur
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      })
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => res.status(500).json({ error }))
    })
    .catch((error) => res.status(500).json({ error }))
}


// Fonction de login d'un utilisateur existant
exports.login = (req, res, next) => {
  // Cherche si un utilisateur avec cet email existe
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res.status(401).json({ message: 'Paire login/mdp incorrecte' })
      } else {
        // Si l'email existe, vérifie que le mdp est correct
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res.status(401).json({ message: 'Paire login/mdp incorrecte' })
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
                  expiresIn: '24h',
                }),
              })
            }
          })
          .catch((error) => res.status(500).json({ error }))
      }
    })
    .catch((error) => res.status(500).json({ error }))
}
