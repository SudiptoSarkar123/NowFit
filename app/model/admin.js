const mongoose = require('mongoose')
const brcypt = require('bcryptjs')

const adminSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,default:'admin'},
})

adminSchema.pre("save",async function (next){
    if(this.isModified('password')){
        this.password = await brcypt.hash(this.password,10)
    }
    next()
})


module.exports = mongoose.model('admin',adminSchema)