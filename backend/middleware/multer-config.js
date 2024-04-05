const multer = require('multer')
const SharpMulter = require('sharp-multer')


// Fonction de création du nom de fichier
const newFilenameFunction = (og_filename, options) => {
  const newname =
    og_filename.split(' ').join('_').split('.').slice(0, -1) + // Supprime les espaces dans le nom d'origine et les remplace par des _, puis supprime l'extension existante
    Date.now() + // ajoute la date
    '.' +
    options.fileFormat // ajoute le format (webp en l'occurence)
  return newname
}


// Fonction de compression/convertion et enregistrement de l'image
const storage = SharpMulter({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },

  imageOptions: {
    fileFormat: 'webp',   // Transforme l'image uploadée en webp
    quality: 80,   // Réduit la qualité à 80%
    resize: { width: 500, height: 500 }, // Modifie les dimensions de l'image
  },

  filename: newFilenameFunction,
})

module.exports = multer({ storage }).single('image')
