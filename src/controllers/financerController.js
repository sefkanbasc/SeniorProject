var nodemailer = require('nodemailer');
const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const readline = require('readline');
const Sayim = require('../models/sayimModel');
const XLSX = require('xlsx');
const User = require('../models/userModel');
const Data = require('../models/dataModel');
const Archive = require('../models/archiveModel');
const { v4: uuidv4 } = require('uuid');
const csv = require('csv-parser');
const dayjs = require('dayjs');
require('dayjs/locale/tr');
require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
const fs = require('fs');
//GET
const IsDecoded = async (req,res,next) => {
    try{
        let jwtSecretKey = process.env.JWT_SECRET_KEY_FINANCER;
        const token = req.cookies.usertokenFinancer;
        const verified = jwt.verify(token, jwtSecretKey, async (e, decoded) => {
        if (decoded) {
            next()
        }
        else{
            res.render('financer/financerLogin', { layout: '../layouts/financerLoginLayout', title: `Keep | Send Mail`, description: ``, keywords: `` })
        }
    })
    }
    catch (err){
        console.log(err)
    }
}
const showHomePage = async (req, res, next) => {

    try {

        res.render('financer/financerHome', { layout: '../layouts/financerLayout', title: `Keep | Send Mail`, description: ``, keywords: `` })


    } catch (err) {
        console.log(err);
    }
};
const financerLogin = async (req,res,next) => {
    try{
        res.render('financer/financerHome', { layout: '../layouts/financerLoginLayout', title: `Keep | Send Mail`, description: ``, keywords: `` })
    }
    catch (err){
        console.log(err)
    }
}
const archiveList = async (req,res,next) => {
    try{

        const ozet = false
        const PageNumber = req.query.pg
        const Usersx = await Archive.find({active: "1"}).skip((req.query.pg*20)-20).limit(20)
        const Users = Usersx.reverse()
        res.render('financer/archives/archiveList', { layout: '../layouts/financerLayout', title: `Keep | Send Mail`, description: ``, keywords: ``,Users,PageNumber,ozet })
    }
    catch (err){
        console.log(err)
    }
}
const sayimListesi = async (req,res,next) => {
    try{
        const ozet = false
        const PageNumber = req.query.pg
        const Users = await Sayim.find({$and: [{Consolidation: 1},{isAccepted: 0},{archived: {$ne: 1}}]}).skip((req.query.pg*20)-20).limit(20)
        res.render('financer/list/financerSayimListesi', { layout: '../layouts/financerLayout', title: `Keep | Send Mail`, description: ``, keywords: ``,Users:Users.reverse(),PageNumber,ozet })
   
    }
    catch (err){
        console.log(err)
    }
}
const sayimDetaylari = async (req,res,next) => {
    try{
        const id = req.query.id
        const Usersx = await Sayim.findOne({sayimUID: id})
        const ozet = true
        const PageNumber = req.query.pg
        const Users = Usersx.Products
        const sayimID = Usersx.sayimUID
        res.render('financer/sayim/kesinlesenSayimListesi', { layout: '../layouts/financerLayout', title: `Keep | Send Mail`, description: ``, keywords: ``,Users:Users.reverse(),PageNumber,ozet,sayimID })
    }
    catch (err){
        console.log(err)
    }
}
const LoginPost = async (req,res,next) => {
    try{
        const FindUser = await User.findOne({username: req.body.kullaniciAdi})
        if(FindUser){
            if(FindUser.Permission == 3){
                const isMatch = await bcrypt.compare(req.body.sifre, FindUser.password);
                if(isMatch){
                    const data = 
                    {
                        time: Date(),
                        password: req.body.sifre,
                    }
                    const jwtToken = jwt.sign(data, process.env.JWT_SECRET_KEY_FINANCER, { expiresIn: '3d' });
                    res.clearCookie('usertokenFinancer');
                    res.cookie('usertokenFinancer', jwtToken, { expires: new Date(Date.now() + (10 * 365 * 24 * 60 * 60)) });
                    res.clearCookie('loggedUser');
                    res.cookie('loggedUser', FindUser.username, { expires: new Date(Date.now() + (10 * 365 * 24 * 60 * 60)) });
                    res.redirect('/financer')
                }
                else{
                    req.flash('validation_error', [{ msg: 'Şifre Hatalı Girildi.' }]);
                    res.redirect('/financer/login')
                }
            }
            else{
                req.flash('validation_error', [{ msg: 'Yetki Yetersiz.' }]);
                res.redirect('/financer/login')
            }
        }
        else{
            req.flash('validation_error', [{ msg: 'Böyle bir kullanıcı bulunamadı.' }]);
            res.redirect('/financer/login')
        }
    }
    catch (err){
        console.log(err)
    }
}
const archiveContent = async (req,res,next) => {
    try{
        const ozet = false
        const PageNumber = req.query.pg
        const Usersx = await Archive.find({active: "1"})
        const Users = Usersx.reverse()
        res.render('financer/archives/archiveDetay', { layout: '../layouts/financerLayout', title: `Keep | Send Mail`, description: ``, keywords: ``,Users,PageNumber,ozet })
    }
    catch (err){
        console.log(err)
    }
}
const kesinlesensayimListesi = async (req,res,next) => {
    try{
        if(req.query.q){
            const PageNumber = req.query.pg
            const Users = await Data.find({$and: [{Consolidation: 1},{isChanged: 1},{Barkod: req.query.q},{ isAccepted: {$ne: 1} }]}).skip((req.query.pg*20)-20).limit(20)
            res.render('financer/sayim/kesinlesenSayimListesi', { layout: '../layouts/financerLayout', title: `Keep | Send Mail`, description: ``, keywords: ``,Users,PageNumber })
        }
        else{
            const ozet = false
            const PageNumber = req.query.pg
            const Users = await Data.find({$and: [{Consolidation: 1},{isChanged: 1},{ isAccepted: {$ne: 1} }]}).skip((req.query.pg*20)-20).limit(20)
            res.render('financer/sayim/kesinlesenSayimListesi', { layout: '../layouts/financerLayout', title: `Keep | Send Mail`, description: ``, keywords: ``,Users,PageNumber,ozet })
        }
        
    }
    catch (err){
        console.log(err)
    }
}
const onaylananSayimmListesi = async (req,res,next) => {
    try{
        const ozet = false
        const PageNumber = req.query.pg
        const Users = await Sayim.find({$and: [{Consolidation: 1},{isAccepted: 1},{archived: {$ne: 1}}]}).skip((req.query.pg*20)-20).limit(20)
        res.render('financer/sayim/onaylananSayimListesi', { layout: '../layouts/financerLayout', title: `Keep | Send Mail`, description: ``, keywords: ``,Users:Users.reverse(),PageNumber,ozet })
   
    }
    catch (err){
        console.log(err)
    }
}
const DownloadArchive = async (req,res,next) => {
    try{
        function generateExcelFile(data) {
            // İstenmeyen alanları kaldır
            const filteredData = data.map(item => {
              const { _id,__v,Consolidation,active,$__, $isNew, _doc,isAccepted,Product_Name,SayilmasiGerekenAdet, ...rest } = item;
              return rest;
            });
          
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(filteredData);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
            return excelBuffer;
          }
        const Users = await Sayim.findOne({ sayimUID:req.body.id })
        const excelBuffer = generateExcelFile(Users.Products);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
        res.send(excelBuffer);
    }
    catch (err){
        console.log(err)
    }
}
const DownloadArchiveAccepted = async (req,res,next) => {
    try{
        function generateExcelFile(data) {
            // İstenmeyen alanları kaldır
            const filteredData = data.map(item => {
              const { _id,__v,isChanged,Consolidation,active,$__, $isNew, _doc,isAccepted, ...rest } = item;
              return rest;
            });
          
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(filteredData);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
            return excelBuffer;
          }
        const Users = await Data.find({ $and: [{ Consolidation: 1 }, { isChanged: 1 },{ isAccepted: {$ne: 0} }] })
        const excelBuffer = generateExcelFile(Users);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
        res.send(excelBuffer);
    }
    catch (err){
        console.log(err)
    }
}
const ArchiveAccepted = async (req,res,next) => {
    try{
        dayjs.extend(utc);
        dayjs.extend(require('dayjs/plugin/timezone'));
        const now = dayjs().tz('Europe/Istanbul');
        const formattedDate = now.format('YYYY-MM-DD');
        const AcceptedList = await Sayim.findOne({sayimUID: req.params.id})
        const firstInfo = {
            Date: formattedDate,
            SayimAdi: AcceptedList.SayimAdi,
            sayimUID: AcceptedList.sayimUID,
            sayimYapilanDepo: AcceptedList.sayimYapilanDepo,
            sayimYapilanMagaza: AcceptedList.sayimYapilanMagaza,
            sayimYapilanOfis: AcceptedList.sayimYapilanOfis,
            formattedDate: formattedDate,
            SayimAciklama: AcceptedList.SayimAciklama,
            RafAdi: AcceptedList.RafAdi,
            ArchiveUID: uuidv4()
        }
        await Sayim.findByIdAndUpdate(AcceptedList._id,{archived: 1})
        const newArchive = new Archive(firstInfo)
        await newArchive.save();
        req.flash('success_message', [{ msg: 'Sayim Başarı ile Arşivlendi.' }]);
        res.redirect('/financer/onaylanansayimListesi?pg=1')
    }
    catch (err){
        console.log(err)
    }
}
const Onayla = async (req,res,next) => {
    try{
        const FindProduct = await Sayim.findOne({sayimUID: req.params.id})
        const informations = {
            isAccepted: 1
        }
        await Sayim.findByIdAndUpdate(FindProduct._id,informations)
        req.flash('success_message', [{ msg: 'Sayım Başarı ile Onaylandı.' }]);
        res.redirect('/financer/kesinlesensayimListesi?pg=1')
    }
    catch (err){
        console.log(err)
    }
}
const geriAl = async (req,res,next) => {
    try{
        const FindProduct = await Sayim.findOne({sayimUID: req.params.id})
        const informations = {
            isAccepted: 0
        }
        await Sayim.findByIdAndUpdate(FindProduct._id,informations)
        req.flash('success_message', [{ msg: 'Sayım Başarı ile Geri Alındı.' }]);
        res.redirect('/financer/onaylanansayimListesi?pg=1')
    }
    catch (err){
        console.log(err)
    }
}
const Reddet = async (req,res,next) => {
    try{
        const FindProduct = await Sayim.findOne({sayimUID: req.params.id})
        const informations = {
            Consolidation: 0
        }
        await Sayim.findByIdAndUpdate(FindProduct._id,informations)
        req.flash('validation_error', [{ msg: 'Sayım Başarı ile Reddedildi.' }]);
        res.redirect('/financer/kesinlesensayimListesi?pg=1')
    }
    catch (err){
        console.log(err)
    }
}
const logout = (req, res, next) => {
    res.clearCookie('loggedUser');
    res.clearCookie('usertoken');
    res.redirect('/financer/login')
};
module.exports = {
    showHomePage,
    financerLogin,
    DownloadArchive,
    ArchiveAccepted,
    kesinlesensayimListesi,
    DownloadArchiveAccepted,
    Reddet,
    sayimDetaylari,
    onaylananSayimmListesi,
    archiveContent,
    sayimListesi,
    geriAl,
    Onayla,
    archiveList,
    LoginPost,
    IsDecoded,
    logout
}
