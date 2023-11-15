const router = require('express').Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const validetorMiddleware = require('../middlewares/validationMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/admin', authMiddleware.oturumAcilmis, adminController.showHomePage)
router.get('/login', authMiddleware.oturumAcilmamis, authController.showLoginForm)


router.post('/login', authMiddleware.oturumAcilmamis, validetorMiddleware.validateLogin(), authController.login)



module.exports = router;