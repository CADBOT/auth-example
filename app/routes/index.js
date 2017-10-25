let express = require('express')
let router = express.Router()
let ctrl = require('../controllers/auth')

router.post('/signup', ctrl.signup)
router.post('/login', ctrl.login)

module.exports = router
