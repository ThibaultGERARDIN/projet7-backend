const emailValidator = require('email-validator')


// Fonction de validation d'email (vérifie que la chaine de caractère correspond à une adresse mail)
const validateEmail = (req, res, next) => {
  const { email } = req.body

  if (!email || !emailValidator.validate(email)) {
    return res.status(400).json({ error: 'Adresse e-mail invalide' })
  }
  next()
}

module.exports = validateEmail
