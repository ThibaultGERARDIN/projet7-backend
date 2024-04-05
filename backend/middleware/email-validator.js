const emailValidator = require('email-validator')

const validateEmail = (req, res, next) => {
  const { email } = req.body

  if (!email || !emailValidator.validate(email)) {
    return res.status(400).json({ error: 'Adresse e-mail invalide' })
  }
  next()
}

module.exports = validateEmail
