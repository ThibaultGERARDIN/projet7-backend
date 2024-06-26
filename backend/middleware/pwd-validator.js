const passwordValidator = require('password-validator')

//  Fonction de validation du mdp : vérifie qu'il répond aux critères renseignés (longeur, majuscule, caracteres spéciaux, chiffres)
const validatePassword = (req, res, next) => {
  const userPassword = req.body.password

  const schema = new passwordValidator()
  schema
    .is()
    .min(8)
    .has()
    .uppercase()
    .has()
    .digits(1)
    .has()
    .symbols(1)
    .has()
    .not()
    .spaces()

  if (!schema.validate(userPassword)) {
    return res.status(400).json({
      error:
        'Mot de passe invalide, doit contenir au moins : 8 caracteres, 1 symbole, 1 majuscule, 1 chiffre',
    })
  }
  next()
}

module.exports = validatePassword
