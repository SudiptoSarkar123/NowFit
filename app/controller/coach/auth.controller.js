const Coach = require('../../model/coach');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Client = require('../../model/client')
const generateRandomPassword = require('../../helper/passwordGenerator')
const { sendMail } = require('../../helper/emailSender');

class CoachController {
    async login(req, res) {
        try {
            // console.log('login');
            const { email, password } = req.body;
            if(!email || !password) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            const coach = await Coach.findOne({ email });
            if (!coach) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            const isPasswordValid = await bcrypt.compare(password, coach.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

             if(coach.firstLogin){
                const token = jwt.sign({_id:coach._id, firstLogin:true},process.env.JWT_SECRET,{expiresIn:'1d'})
                res.cookie('CoachToken', token, { httpOnly: true, secure: true, sameSite: 'strict' });
                return res.status(200).json({ message: 'Login successful', success: true , firstLogin:true  });
            }

            const token = jwt.sign({ _id: coach._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.cookie('CoachToken', token, { httpOnly: true, secure: true, sameSite: 'strict' });
           
           return res.status(200).json({ message: 'Login successful', success: true });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async changePassword(req,res){
        try {
            const {  newPassword } = req.body;
            if(!newPassword) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            const coach = await Coach.findById(req.user._id);
            if (!coach) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
           
            coach.password = newPassword;
            let wasFirstLogin = false;
            if(coach.firstLogin){
                coach.firstLogin = false;
                wasFirstLogin = true;
            }
            await coach.save();
            if(wasFirstLogin){
                return res.status(200).json({ message: 'Password changed successfully', success: true , firstLogin:wasFirstLogin });
            }
            return res.status(200).json({ message: 'Password changed successfully', success: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async updateProfile(req,res){
         try { 
        const coachId = req.user._id; // Set by CoachCheck
        const update = {};

        
        if (req.body.coachType) update.coachType = req.body.coachType;
        if (req.body.workplace) update.workplace = req.body.workplace;
        if (req.body.clientCount) update['profile.clientCount'] = req.body.clientCount;

        await Coach.findByIdAndUpdate(coachId, update, { new: true });
        return res.json({ success: true, message: 'Profile updated.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
    }

    async addFirstClient(req,res){
        try {
        const { clientName, clientEmail } = req.body;
        if (!clientName || !clientEmail) {
            return res.json({ success: false, message: 'No client added.' }); // Optional step
        }

        const existingClient = await Client.findOne({ email: clientEmail });
        if (existingClient) {
            return res.json({ success: true, message: 'Client already exists and added.' , redirectUrl: '/coach/dashboard' });
        }

        const plainPassword = generateRandomPassword(10);
      

       

        // Create client and associate with coach
        const newClient = new Client({
            fullName: clientName,
            email: clientEmail,
            password: plainPassword,
            coach: req.user._id,
            
        });
        await newClient.save();

        // Optionally, send invite email here

        const loginUrl = `http://localhost:3000/auth/client/login`;
        const html = `<p>Your account has been created.<br>
               <b>Login:</b> <a href="${loginUrl}">Login Link</a><br>
                 <b>Username:</b> ${clientEmail}<br>
                 <b>Password:</b> ${plainPassword}</p>`

        await sendMail(clientEmail ,html);

        return res.json({ success: true, message: 'Client added and email sent.', redirectUrl: '/coach/dashboard' });


    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Could not add client.' });
    }
    }

    async logout(req, res) {
        try {
            res.clearCookie('CoachToken');
            return res.redirect('/auth/coach/login');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
   
}


module.exports = new CoachController();