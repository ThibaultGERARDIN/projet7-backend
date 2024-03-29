const Book = require('../models/Book')
const fs = require('fs')

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book)
  delete bookObject._id
  delete bookObject._userId
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    averageRating: bookObject.ratings[0].grade,
  })
  book
    .save()
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch((error) => res.status(400).json({ error }))
}

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : { ...req.body }

  delete bookObject._userId
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' })
      } else {
        if (req.file) {
          const filename = book.imageUrl.split('/images/')[1]
          fs.unlink(`images/${filename}`, (error) => {
            if (error) {
              console.log(error)
            }
          })
        }
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id },
        )
          .then(() => res.status(200).json({ message: 'Livre modifié !' }))
          .catch((error) => res.status(400).json({ error }))
      }
    })
    .catch((error) => res.status(404).json({ error }))
}

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' })
      } else {
        const filename = book.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
            .catch((error) => res.status(400).json({ error }))
        })
      }
    })
    .catch((error) => res.status(404).json({ error }))
}

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }))
}

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }))
}

exports.getBestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Trie les données par averageRating décroissant (-1)
    .limit(3) // Garde uniquement les 3 premiers résultats
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }))
}

exports.addRating = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const ratings = book.ratings
      if (ratings.some((obj) => obj.userId === req.auth.userId)) {
        res.status(401).json({ message: 'Déjà noté' })
      } else {
        const newRating = {
          userId: req.auth.userId,
          grade: req.body.rating,
        }
        ratings.push(newRating)
      }

      // Calcule la nouvelle note moyanne
      const numberOfRatings = book.ratings.length
      const sumOfRatings = book.ratings.reduce(
        (sum, rating) => sum + rating.grade,
        0,
      )
      const averageRating = sumOfRatings / numberOfRatings
      book.averageRating = averageRating

      book
        .save()
        .then((updatedBook) => {
          res.status(200).json(updatedBook)
        })
        .catch((error) => res.status(400).json({ error }))
    })

    .catch((error) => res.status(404).json({ error }))
}
