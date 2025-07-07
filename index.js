const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

const dbcon = require('./app/config/dbcon');
const Admin = require('./app/model/admin');

// Load environment variables
dotenv.config();

// Connect to database
dbcon();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(cookieParser());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create first admin if not exists
async function createFirstAdmin() {
    const admin = await Admin.findOne({ role: "admin" });
    if (!admin) {
        console.log("NO admin found...");
        console.log('Creating first admin...');
        const firstAdmin = new Admin({
            name: 'First Admin',
            email: 'admin355@example.com',
            password: 123,
            role: 'admin'
        });
        await firstAdmin.save();
        console.log('First Admin created successfully ✅');
    }
}
createFirstAdmin();


// Routes
const adminAuthRoutes = require('./app/router/admin/auth.route');
const adminDashRoutes = require('./app/router/admin/Static.route');
const adminApiRoutes = require('./app/router/admin/api.route')

// Coach Routes
const coachAuthRoutes = require('./app/router/coach/auth.route');
const coachDashRoutes = require('./app/router/coach/static.route');
const coachApiRoutes = require('./app/router/coach/api.route')

app.use('/admin', adminDashRoutes);
app.use('/auth/admin', adminAuthRoutes);
app.use('/api/admin',adminApiRoutes)

app.use('/coach', coachDashRoutes);
app.use('/auth/coach', coachAuthRoutes);
app.use('/coach',coachApiRoutes)

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});