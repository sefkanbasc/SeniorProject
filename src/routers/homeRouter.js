const router = require('express').Router();
const homeController = require('../controllers/homeController');
const multerConfig = require('../config/multerConfig');
const UserController = require('../controllers/UserController');

router.get('/',UserController.IsDecoded,UserController.homePage);
router.get('/archives',UserController.IsDecoded,UserController.ArchivesGet)
router.get('/announcement',UserController.IsDecoded,UserController.AnnouncementsGet)
router.get('/contact',UserController.IsDecoded,UserController.ContactGet)
router.get('/aboutTheJournal',UserController.IsDecoded,UserController.AboutTheJournalGet)
router.get('/Submission',UserController.IsDecoded,UserController.SubmissionGet)
router.get('/editorialTeam',UserController.IsDecoded,UserController.editorialTeamGet)
router.get('/privacyStatement',UserController.IsDecoded,UserController.privacyStatementGet)
router.get('/register',UserController.IsDecoded,UserController.RegisterGet)
router.get('/user/panel',UserController.IsDecoded,UserController.userPanelMainPageGet)
router.get('/user/useraddthesis',UserController.IsDecoded,UserController.userPanelAddThesisPageGet)


router.get('/logout',UserController.logout)
router.post('/test',homeController.test)

router.post('/registerPost', UserController.Register);



//Login
router.post('/api/getProduct',homeController.AuthorizationCheck,homeController.getProduct)
router.post('/api/getSayimList',homeController.AuthorizationCheck,homeController.getSayimList)
router.post('/api/postSayim',homeController.AuthorizationCheck,homeController.postSayim)
router.post('/api/login',homeController.AuthorizationCheck,homeController.LoginPost)








module.exports = router;
