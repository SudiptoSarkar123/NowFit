const transporter = require('../config/emailConfig')

const sendMail = async (clientEmail, html)=>{
    try {
        await transporter.sendMail({
            form:process.env.EMAIL_FROM,
            to:clientEmail,
            subject:'Email Verification🔥',
            html:html
        })
        console.log('Mail sent successfully')
        return 'success'
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status:false,
            message:'email error'
        })
    }   
}

module.exports = { sendMail }