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
    Name: {
      type: String,
    },
    Surname:{
      type: String,
    },
    Department: {
      type: String,
      trim: true
    },
    userUniqueID: {
      type: String,
      trim: true
    },
    Permission: {
      type: Number,
      trim: true
    },
    PhoneNumber: {
      type: String,
      trim: true
    },
    Email: {
      type: String,
      trim: true
    },
    active:{
      type: String,
      default: "1"
    }
   
}, { collection: 'Users', timestamps: true });

const Admin = mongoose.model('Users', UserSchema);

module.exports = Admin;