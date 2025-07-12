const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Client = require('../../model/client');
class AuthController {
      async login(req, res) {
            try {
                const { email, password } = req.body;
                console.log(email);
    
                const client = await Client.findOne({ email })
                if (!client) {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }
    
                // compare the password
                const result = bcrypt.compareSync(password, client.password);
                if (!result) {
                    console.log('Password does not match');
                    return res.status(401).json({
                        error: 'Invalid email or password'
                    })
                }
                // create a token
                const token = jwt.sign({
                    _id: client._id,
                }, process.env.JWT_SECRET, { expiresIn: '1d' })
                // set the token in cookie
                res.cookie('ClientToken', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict'
                })
                console.log('Login successful');
                return res.status(200).json({ message: 'Login successful', success: true , redirectUrl:'/client/dashboard' });
            } catch (error) {
                console.error('Login error:', error);
                res.status(500).json({ error: 'Internal server error' })
            }
        }
}

module.exports = new AuthController();