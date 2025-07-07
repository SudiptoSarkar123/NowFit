const jwt = require('jsonwebtoken');
const Coach = require('../model/coach');

const CoachCheck = async (req,res,next)=>{
    try {
        const token = req.headers['authorization'] || req.cookies.CoachToken;
        if(!token){
            return res.redirect('/auth/coach/login').json({
                status:false,
                message:'Unauthorised: No token provided'
            })
        }
        

        const decode = jwt.verify(token,process.env.JWT_SECRET)

        req.user = await Coach.findById(decode._id).select('-password') ;
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

module.exports = CoachCheck ;