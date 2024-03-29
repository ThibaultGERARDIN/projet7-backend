const multer = require('multer')

const SharpMulter = require('sharp-multer')

const newFilenameFunction = (og_filename, options) => {
  const newname =
    og_filename.split(' ').join('_').split('.').slice(0, -1) + // Supprime les espaces dans le nom d'origine et les remplace par des _, puis supprime l'extension existante
    Date.now() + // ajoute la date
    '.' +
    options.fileFormat // ajoute le format (webp en l'occurence)
  return newname
}

const storage = SharpMulter({
  destination: (req, file, callback) => {
    callback(null, 'images')
  },

  imageOptions: {
    fileFormat: 'webp',
    quality: 80,
    resize: { width: 500, height: 500 },
  },

  filename: newFilenameFunction,
})

module.exports = multer({ storage }).single('image')
