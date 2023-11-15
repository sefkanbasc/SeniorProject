var nodemailer = require('nodemailer');
const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const readline = require('readline');
const User = require('../models/userModel');
const xlsx = require('xlsx');
const Data = require('../models/dataModel');
const { v4: uuidv4 } = require('uuid');
const csv = require('csv-parser');
const fs = require('fs');
//GET
const showHomePage = async (req, res, next) => {

    try {

        res.render('admin/homePage', { layout: '../layouts/adminHome_Layout', title: `Keep | Send Mail`, description: ``, keywords: `` })


    } catch (err) {
        console.log(err);
    }
};
const sifreDegistir = async (req,res,next) => {
    try{
        res.render('admin/changePassword', { layout: '../layouts/adminHome_Layout', title: `Keep | Send Mail`, description: ``, keywords: `` })
    }
    catch (err){
        console.log(err)
    }
}
const KullaniciEkle = async (req,res,next) => {
  try{
    res.render('admin/userTransactions/adduser', { layout: '../layouts/adminHome_Layout', title: `Keep | Send Mail`, description: ``, keywords: `` })
  }
  catch (err){
    console.log(err)
  }
}
const kullanicilariListele = async (req,res,next) => {
  try{
    const Users = await User.find({active: "1"})
    res.render('admin/userTransactions/edituser', { layout: '../layouts/adminHome_Layout', title: `Keep | Send Mail`, description: ``, keywords: ``,Users })
  }
  catch (err){
    console.log(err)
  }
}


const AddUser = async (req,res,next) => {
    try{
        const FindUserCount = await User.count({username: req.body.username})
        if(FindUserCount == 0){ 
            const informations = {
                username: req.body.username,
                password: await bcrypt.hash(req.body.password, 8),
                Department: req.body.Departman,
                Permission: req.body.Permission,
                Name: req.body.name,
                Surname: req.body.surname,
                Email:  req.body.email,
                PhoneNumber: req.body.phoneNumber,
                userUniqueID: uuidv4()

            }
            const newUser = new User(
                informations
            )
            await newUser.save();
            req.flash('success_message', [{ msg: 'Kullanıcı Başarı ile Eklendi.' }]);
            res.redirect('/admin/kullaniciEkle')
        }
        else{
            req.flash('validation_error', [{ msg: 'Bu kullanıcı zaten ekli.' }]);
            res.redirect('/admin/kullaniciEkle')
        }
    }
    catch (err){
        console.log(err)
    }
}
const RemoveUser = async (req,res,next) => {
    try{
        const FindUser = await User.findOne({userUniqueID: req.params.id})
        await User.findByIdAndRemove(FindUser._id)
        req.flash('success_message', [{ msg: 'Kullanıcı Başarı ile Silindi.' }]);
        res.redirect('/admin/kullanicilariListele')
    }
    catch (err){
        console.log(err)
    }
}
const EditUser = async (req,res,next) =>{
    try{
        const FindUser = await User.findOne({username: req.body.username})
        const informations = {
            username: req.body.username,
            Department: req.body.Departman,
            Permission: req.body.Permission,
            Name: req.body.name,
            Surname: req.body.surname,
            Email:  req.body.email,
            PhoneNumber: req.body.phoneNumber
        }
        await User.findByIdAndUpdate(FindUser._id,informations)
        req.flash('success_message', [{ msg: 'Kullanıcı Başarı ile Düzenlendi.' }]);
        res.redirect('/admin/kullanicilariListele')
    }
    catch (err){
        console.log(err)
    }
}
const sifreDegistirPost = async (req,res,next) => {
    try{
        const oldPassword = req.body.oldPassword
        const newPassword = req.body.newPassword
        const RenewPassword = req.body.RenewPassword
        const findUser = await Admin.findOne({isim:req.user.isim})
        const isMatch = await bcrypt.compare(oldPassword, findUser.sifre);
        if(isMatch){
            if(newPassword == RenewPassword){
                await Admin.findByIdAndUpdate(findUser._id,{sifre:await bcrypt.hash(newPassword, 8)})
                req.flash('success_message', [{ msg: 'Şifre Başarı İle Değiştirildi.' }]);
                res.redirect('/admin/sifredegistir')
            }
            else{
                req.flash('validation_error', [{ msg: 'Yeni Şifreler Eşleşmiyor.' }]);
                res.redirect('/admin/sifredegistir')
            }
        }
        else{
            req.flash('validation_error', [{ msg: 'Eski Şifre Eşleşmiyor.' }]);
            res.redirect('/admin/sifredegistir')
        }
        
    }
    catch (err){
        console.log(err)
    }
}

const logout = (req, res, next) => {
    res.clearCookie('connect.sid');
    res.redirect('../admin/login')
};
module.exports = {
    showHomePage,
    sifreDegistir,
    RemoveUser,
    sifreDegistirPost,
    AddUser,
    kullanicilariListele,
    KullaniciEkle,
    EditUser,
    logout


}