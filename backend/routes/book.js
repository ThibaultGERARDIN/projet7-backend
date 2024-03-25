const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const bookCtrl = require('../controllers/book')

router.get('/', bookCtrl.getAllBooks)
router.post('/', auth, multer, bookCtrl.createBook)
router.get('/:id', bookCtrl.getOneBook)
router.get('/bestrating', bookCtrl.getBestRatedBooks)
router.post('/:id/rating', auth, bookCtrl.addRating)
router.put('/:id', auth, multer, bookCtrl.modifyBook)
router.delete('/:id', auth, bookCtrl.deleteBook)

module.exports = router
