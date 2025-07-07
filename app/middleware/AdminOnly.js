const jwt = require('jsonwebtoken')
// const User = require('../model/Users')
const Admin = require('../model/admin')
const AdminCheck = async (req,res,next)=>{
    try {
        const token = req.headers['authorization'] || req.cookies.AuthToken;
        if(!token){
            return res.redirect('/auth/admin/login').json({
                status:false,
                message:'Unauthorised: No token provided'
            })
        }
        // console.log("token",token);

        const decode = jwt.verify(token,process.env.JWT_SECRET)

        req.user = await Admin.findById(decode.id).select('-password') ;
        if(!req.user){
            return res.redirect('/auth/admin/login').json({message:'User not found...'})
        }
        next();
    } catch (error) {
         return res.redirect('/auth/admin/login').json({
                status:false,
                message:'Unauthorised: No token provided'
            })
    }
}

module.exports = AdminCheck