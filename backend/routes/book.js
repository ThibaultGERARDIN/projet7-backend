const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const bookCtrl = require('../controllers/book')

router.get('/', bookCtrl.getAllBooks)
router.get('/bestrating', bookCtrl.getBestRating)
router.get('/:id', bookCtrl.getOneBook)
router.post('/', auth, multer, bookCtrl.createBook)
router.post('/:id/rating', auth, bookCtrl.addRating)
router.put('/:id', auth, multer, bookCtrl.modifyBook)
router.delete('/:id', auth, bookCtrl.deleteBook)

module.exports = router
