
const { Router } = require('express')
const { validateRegister } = require('../middlewares/users.validation')
const { getAllUsers, register, login } = require('../controllers/users.controller')

const router = Router();


router.route('/').get(getAllUsers)
router.route('/register').post(validateRegister(), register)
router.route('/login').post(login)




module.exports = router;