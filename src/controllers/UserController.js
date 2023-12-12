const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Sayim = require('../models/sayimModel');
const Data = require('../models/dataModel');
const Urun = require('../models/dataModel');
const IsDecoded = async (req, res, next) => {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = req.cookies.usertoken;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
            if (decoded) {
                const layout = '../layouts/mainSecond_Layout'
                req.customData = {
                    message: layout,
                };
                next()
            }
            else {
                const layout = '../layouts/mainSecond_Layout'
                req.customData = {
                    message: layout,
                };
                next()
            }
        })
    }
    catch (err) {
        console.log(err)
    }
}
const homePage = async (req, res, next) => {
    try {
        res.render('user/userHomePage', { layout: req.customData.message, title: `Keep | Send Mail`, description: ``, keywords: `` })
    }
    catch (err) {
        console.log(err)
    }
}
const ArchivesGet = async (req, res, next) => {
    try {
        res.render('user/archives', { layout: req.customData.message, title: `Keep | Send Mail`, description: ``, keywords: `` })
    }
    catch (err) {
        console.log(err)
    }
}
const AnnouncementsGet = async (req, res, next) => {
    try {
        res.render('user/announcements', { layout: req.customData.message, title: `Keep | Send Mail`, description: ``, keywords: `` })
    }
    catch (err) {
        console.log(err)
    }
}
const ContactGet = async (req, res, next) => {
    try {
        res.render('user/contact', { layout: req.customData.message, title: `Keep | Send Mail`, description: ``, keywords: `` })
    }
    catch (err) {
        console.log(err)
    }
}
const AboutTheJournalGet = async (req, res, next) => {
    try {
        res.render('user/aboutthejournal', { layout: req.customData.message, title: `Keep | Send Mail`, description: ``, keywords: `` })
    }
    catch (err) {
        console.log(err)
    }
}
const SubmissionGet = async (req, res, next) => {
    try {
        res.render('user/submission', { layout: req.customData.message, title: `Keep | Send Mail`, description: ``, keywords: `` })
    }
    catch (err) {
        console.log(err)
    }
}
const RegisterGet = async (req, res, next) => {
    try {
        res.render('user/register', { layout: req.customData.message, title: `Keep | Send Mail`, description: ``, keywords: `` })
    }
    catch (err) {
        console.log(err)
    }
}
const editorialTeamGet = async (req, res, next) => {
    try {
        res.render('user/editorialTeam', { layout: req.customData.message, title: `Keep | Send Mail`, description: ``, keywords: `` })
    }
    catch (err) {
        console.log(err)
    }
}
const privacyStatementGet = async (req, res, next) => {
    try {
        res.render('user/privacyStatement', { layout: req.customData.message, title: `Keep | Send Mail`, description: ``, keywords: `` })
    }
    catch (err) {
        console.log(err)
    }
}
const userPanelMainPageGet = async (req,res,next) => {
    try{
        const idUser = 0
        res.render('user/panel/user-index', { layout: "../layouts/free", title: `Keep | Send Mail`, description: ``, keywords: ``,idUser })
    }
    catch (err){
        console.log(err)
    }
}
const userPanelInfoPageGet = async (req,res,next) => {
    try{
        const idUser = 0
        res.render('user/panel/user-info', { layout: "../layouts/free", title: `Keep | Send Mail`, description: ``, keywords: ``,idUser })
    }
    catch (err){
        console.log(err)
    }
}
const userPanelAddThesisPageGet = async (req,res,next) => {
    try{
        const idUser = 0
        res.render('user/panel/user-add-thesis', { layout: "../layouts/free", title: `Keep | Send Mail`, description: ``, keywords: ``,idUser })
    }
    catch (err){
        console.log(err)
    }
}




const Register = async (req, res, next) => {
    try {
        const saltRounds = 10;
        const passwordToHash = req.body.password;

        const passwordHash = await bcrypt.hash(passwordToHash, saltRounds);

        const informations = {
            username: req.body.username,
            password: passwordHash,
            affiliation: req.body.affiliation,
            email: req.body.email,
            givenName: req.body.givenName,
            familyName: req.body.familyName,
            country: req.body.country,
            privacyAgreement : req.body.privacyAgreement,
            notifyAgreement: req.body.notifyAgreement,
            journalAgreement: req.body.journalAgreement
        };

        const newUser = new User(informations);
        await newUser.save();

        res.redirect("../");
    } catch (err) {
        console.log("Hata:", err);
    }
};




const logout = (req, res, next) => {
    res.clearCookie('loggedUser');
    res.clearCookie('usertoken');
    res.redirect('/login')
};
module.exports = {

    homePage,
    AnnouncementsGet,
    AboutTheJournalGet,
    IsDecoded,
    userPanelMainPageGet,
    SubmissionGet,
    privacyStatementGet,
    userPanelInfoPageGet,
    userPanelAddThesisPageGet,
    ContactGet,
    RegisterGet,
    editorialTeamGet,
    ArchivesGet,
    Register,
    logout
}
