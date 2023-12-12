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








































const sayimListesi = async (req, res, next) => {
    try {
        const ozet = false
        const PageNumber = req.query.pg
        const Users = await Sayim.find({ $and: [{ Consolidation: 0 }] }).skip((req.query.pg * 20) - 20).limit(20)
        res.render('user/sayimListeleri/sayimListeleri', { layout: '../layouts/mainHome_Layout', title: `Keep | Send Mail`, description: ``, keywords: ``, Users: Users.reverse(), PageNumber, ozet })

    }
    catch (err) {
        console.log(err)
    }
}
const sayimDetaylari = async (req, res, next) => {
    try {
        const id = req.query.id
        const Usersx = await Sayim.findOne({ sayimUID: id })
        const ozet = true
        const PageNumber = req.query.pg
        const Users = Usersx.Products
        const sayimID = Usersx.sayimUID
        res.render('user/sayim/sayimListesiDetay', { layout: '../layouts/mainHome_Layout', title: `Keep | Send Mail`, description: ``, keywords: ``, Users: Users.reverse(), PageNumber, ozet, sayimID })
    }
    catch (err) {
        console.log(err)
    }
}
const OzetSayimListesi = async (req, res, next) => {
    try {
        const id = req.query.id
        const Usersx = await Sayim.findOne({ sayimUID: id })
        const ozet = true
        const Users = []
        const PageNumber = req.query.pg
        const list = Usersx.Products
        for (let i = 0; i < list.length; i++) {
            if (Number(list[i].SayilmasiGerekenAdet) - Number(list[i].SayilanAdet) != 0) {
                Users.push(list[i])
            }
        }
        const sayimID = Usersx.sayimUID
        res.render('user/sayim/sayimListesiDetay', { layout: '../layouts/mainHome_Layout', title: `Keep | Send Mail`, description: ``, keywords: ``, Users, PageNumber, ozet, sayimID })
    }
    catch (err) {
        console.log(err)
    }
}
const Login = async (req, res, next) => {
    try {
        res.render('user/loginPage', { layout: '../layouts/mainSecond_Layout', title: `Keep | Send Mail`, description: ``, keywords: `` })
    }
    catch (Err) {
        console.log(Err)
    }
}
const LoginPost = async (req, res, next) => {
    try {
        const FindUser = await User.findOne({ username: req.body.kullaniciAdi })
        if (FindUser) {
            if (FindUser.Permission == 1) {
                const isMatch = await bcrypt.compare(req.body.sifre, FindUser.password);
                if (isMatch) {
                    const data =
                    {
                        time: Date(),
                        password: req.body.sifre,
                    }
                    const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '3d' });
                    res.clearCookie('usertoken');
                    res.cookie('usertoken', jwtToken, { expires: new Date(Date.now() + (10 * 365 * 24 * 60 * 60)) });
                    res.clearCookie('loggedUser');
                    res.cookie('loggedUser', FindUser.username, { expires: new Date(Date.now() + (10 * 365 * 24 * 60 * 60)) });
                    res.redirect('/')
                }
                else {
                    req.flash('validation_error', [{ msg: 'Şifre Hatalı Girildi.' }]);
                    res.redirect('/login')
                }
            }
            else {
                req.flash('validation_error', [{ msg: 'Yetki Yetersiz.' }]);
                res.redirect('/login')
            }
        }
        else {
            req.flash('validation_error', [{ msg: 'Böyle bir kullanıcı bulunamadı.' }]);
            res.redirect('/login')
        }
    }
    catch (err) {
        console.log(err)
    }
}
const TopluConsolidation = async (req, res, next) => {
    try {
        const findAll = await Data.find({ $and: [{ Consolidation: 0 }, { isChanged: 1 }] })
        for (let i = 0; i < findAll.length; i++) {
            const FindProduct = await Urun.findOne({ Barkod: findAll[i].Barkod })
            const informations = {
                Consolidation: 1,
                isAccepted: 0,
            }
            await Urun.findByIdAndUpdate(findAll[i]._id, informations)
        }
        req.flash('success_message', [{ msg: 'Ürün Başarı ile Kesinleştirildi.' }]);
        res.redirect('/sayimListesi?pg=1')
    }
    catch (err) {
        console.log(err)
    }
}
const Consolidation = async (req, res, next) => {
    try {
        const FindProduct = await Sayim.findOne({ sayimUID: req.params.id })
        const informations = {
            Consolidation: 1,
            isAccepted: 0,
        }
        await Sayim.findByIdAndUpdate(FindProduct._id, informations)
        req.flash('success_message', [{ msg: 'Sayim Başarı ile Kesinleştirildi.' }]);
        res.redirect('/sayimListesi?pg=1')
    }
    catch (err) {
        console.log(err)
    }
}
const EditProduct = async (req, res, next) => {
    try {
        const FindUser = await Sayim.findOne({ sayimUID: req.params.id })
        const informations = {
            SayimAdi: req.body.SayimAdi,
            RafAdi: req.body.RafAdi,
            SayimAciklama: req.body.SayimAciklama
        }
        await Sayim.findByIdAndUpdate(FindUser._id, informations)
        req.flash('success_message', [{ msg: 'Sayim Başarı ile Düzenlendi.' }]);
        res.redirect('/sayimListesi?pg=1')
    }
    catch (err) {
        console.log(err)
    }
}
const CancelSayim = async (req, res, next) => {
    try {
        const FindUser = await Sayim.findOne({ sayimUID: req.params.id })
        await Sayim.findByIdAndRemove(FindUser._id)
        req.flash('success_message', [{ msg: 'Sayim Başarı ile İptal Edildi.' }]);
        res.redirect('/sayimListesi?pg=1')
    }
    catch (err) {
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
    Login,
    homePage,
    AnnouncementsGet,
    AboutTheJournalGet,
    IsDecoded,
    CancelSayim,
    EditProduct,
    SubmissionGet,
    privacyStatementGet,
    ContactGet,
    RegisterGet,
    LoginPost,
    editorialTeamGet,
    sayimDetaylari,
    OzetSayimListesi,
    ArchivesGet,
    Consolidation,
    sayimListesi,
    TopluConsolidation,
    Register,
    logout
}
