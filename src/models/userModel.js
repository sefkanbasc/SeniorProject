const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    affiliation: {
      type: String,
    },
    email:{
      type: String,
    },
    givenName: {
      type: String,
    },
    privacyAgreement: {
      type: String,
    },
   
    notifyAgreement: {
      type: String,
    },
   
    journalAgreement: {
      type: String,
    },
    role:{
      type:Number,
      default: 1
    },
    active:{
      type: String,
      default: "1"
    }
   
}, { collection: 'Users', timestamps: true });

const Admin = mongoose.model('Users', UserSchema);

module.exports = Admin;