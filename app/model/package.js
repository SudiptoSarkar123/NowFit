const mongoose = require('mongoose');

const PackageSchema = mongoose.Schema({
    name:{type:String, required:true},
    price:{type:Number, required:true},
    duration:{type:String, enum:['one-time','monthly', 'quarterly', 'yearly'], required:true},
    description:{type:String, required:true},
    status:{
        type:String,
        enum:['active', 'inactive'],
        default:'active'
    },
    dateAdded:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('package', PackageSchema);