
const { Router } = require('express')
const { validateRegister } = require('../middlewares/users.validation')
const { getAllUsers, register, login } = require('../controllers/users.controller')
const { verifyToken } = require('../middlewares/verifyToken')
const multer = require('multer')
const AppError = require('../utils/appError')
const router = Router();

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1]
        const filename = `user-${Date.now()}.${ext}`
        cb(null, filename)
    }
})
const fileFilter = (req, file, cb) => {

    if (file.mimetype.startsWith('image/')) {
        return cb(null, true)
    } else {
        return cb(AppError.create('file must be an image', 400), false)

    }
}
const upload = multer({ storage: diskStorage, fileFilter })

router.route('/').get(verifyToken, getAllUsers)
router.route('/register').post(upload.single('avatar'), validateRegister(), register)
router.route('/login').post(login)




module.exports = router;