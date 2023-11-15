const router = require('express').Router();
const adminController = require('../controllers/adminController');
const validetorMiddleware = require('../middlewares/validationMiddleware');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const MulterConfig = require('../config/multerConfig')
/*get*/   
router.get('/', authMiddleware.oturumAcilmis, adminController.showHomePage);
router.get('/sifredegistir',authMiddleware.oturumAcilmis,adminController.sifreDegistir)
router.get('/kullaniciEkle',authMiddleware.oturumAcilmis,adminController.KullaniciEkle)
router.get('/kullanicilariListele',authMiddleware.oturumAcilmis,adminController.kullanicilariListele)
router.get('/logout',authMiddleware.oturumAcilmis,adminController.logout)

router.post('/sifreDegistir',authMiddleware.oturumAcilmis,adminController.sifreDegistirPost)
router.post('/addUser',authMiddleware.oturumAcilmis,adminController.AddUser)
router.post('/removeUser/:id',authMiddleware.oturumAcilmis,adminController.RemoveUser)
router.post('/editUser/:id',authMiddleware.oturumAcilmis,adminController.EditUser)
module.exports = router;