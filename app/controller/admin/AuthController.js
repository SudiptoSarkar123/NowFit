const Admin = require('../../model/admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class AdminController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            console.log(req.body);

            const admin = await Admin.findOne({ email })
            if (!admin) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // compare the password
            const result = bcrypt.compareSync(password, admin.password);
            if (!result) {
                return res.status(401).json({
                    error: 'Invalid email or password'
                })
            }
            // create a token
            const token = jwt.sign({
                id: admin._id,
            }, process.env.JWT_SECRET, { expiresIn: '1d' })
            // set the token in cookie
            res.cookie('AuthToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict'
            })
            console.log('Login successful');
            return res.redirect('/admin/dashboard')
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie('AuthToken');
            return res.redirect('/auth/admin/login');

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}


module.exports = new AdminController();