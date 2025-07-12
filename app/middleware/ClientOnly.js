const jwt = require('jsonwebtoken');

const Client = require('../model/client');
const ClientCheck = async (req,res,next)=>{
    try {
        const token = req.headers['authorization'] || req.cookies.ClientToken;
        if(!token){
           return res.redirect('/auth/client/login')
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET)
        console.log(decode);
        req.user = await Client.findById(decode._id).select('-password') ;
        if(!req.user)return res.status(404).json({message:'User not found...'})
        next();
    } catch (error) {
         console.log(error)
        res.status(401).json({
            status:false,
            message:'Invalid or expired token'
        })
    }
}

module.exports = ClientCheck ;