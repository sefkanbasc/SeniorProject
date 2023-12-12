const router = require('express').Router();
const homeController = require('../controllers/homeController');
const multerConfig = require('../config/multerConfig');
const ShopController = require('../controllers/ShopController');

router.get('/',ShopController.IsDecoded,ShopController.homePage);
router.get('/archives',ShopController.IsDecoded,ShopController.ArchivesGet)
router.get('/announcement',ShopController.IsDecoded,ShopController.AnnouncementsGet)
router.get('/contact',ShopController.IsDecoded,ShopController.ContactGet)
router.get('/aboutTheJournal',ShopController.IsDecoded,ShopController.AboutTheJournalGet)
router.get('/Submission',ShopController.IsDecoded,ShopController.SubmissionGet)
router.get('/editorialTeam',ShopController.IsDecoded,ShopController.editorialTeamGet)
router.get('/privacyStatement',ShopController.IsDecoded,ShopController.privacyStatementGet)
router.get('/register',ShopController.IsDecoded,ShopController.RegisterGet)




router.get('/sayimListesi',ShopController.IsDecoded,ShopController.sayimListesi)
router.get('/sayimDetaylari',ShopController.IsDecoded,ShopController.sayimDetaylari)
router.get('/ozetsayimListesi',ShopController.IsDecoded,ShopController.OzetSayimListesi)
router.get('/login',ShopController.IsDecoded,ShopController.Login);
router.get('/logout',ShopController.logout)
router.post('/test',homeController.test)

router.post('/loginPost',ShopController.LoginPost)
router.post('/registerPost', ShopController.Register);
router.post('/Consolidation/:id',ShopController.IsDecoded,ShopController.Consolidation)
router.post('/editProduct/:id',ShopController.IsDecoded,ShopController.EditProduct)
router.post('/CancelSayim/:id',ShopController.IsDecoded,ShopController.CancelSayim)
router.post('/TopluConsolidation',ShopController.IsDecoded,ShopController.TopluConsolidation)


//Login
router.post('/api/getProduct',homeController.AuthorizationCheck,homeController.getProduct)
router.post('/api/getSayimList',homeController.AuthorizationCheck,homeController.getSayimList)
router.post('/api/postSayim',homeController.AuthorizationCheck,homeController.postSayim)
router.post('/api/login',homeController.AuthorizationCheck,homeController.LoginPost)








module.exports = router;
