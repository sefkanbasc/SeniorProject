const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    SayimAdi: {
        type: String,
        trim: true,
    },
    CVirgul: {
        type: String,
        default: ",",
        trim: true,
    },
    Products: {
        type: Array,
    },
    sayimUID:{
      type: String,
    },
    SayimAciklama: {
        type: String,
        trim: true
    },
    RafAdi : {
        type: String
    },
    sayimYapilanDepo: {
        type: String
    },
    sayimYapilanOfis: {
        type: String
    },
    sayimYapilanMagaza: {
        type: String
    },
    isAccepted: {
        type: Number
    },
    Consolidation: {
        type: Number
    },
    Is_Rejected : {
        type: Number
    },
    formattedDate: {
        type: String
    },
    active: {
        type: String,
        default: "1"
    },
    archived: {
        type: Number
    }

}, { collection: 'Sayimlar', timestamps: true });

const Admin = mongoose.model('Sayimlar', UserSchema);

module.exports = Admin;