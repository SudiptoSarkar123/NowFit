const Coach = require('../../model/coach');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Client = require('../../model/client')
const generateRandomPassword = require('../../helper/passwordGenerator')
const { sendMail } = require('../../helper/emailSender');
const Category = require('../../model/category');
const Workout = require('../../model/workouts');
class CoachController {
    async allClientsForTheCoach(req, res) {
        try {
            const clients = await Client.find({ coach: req.user._id }).populate('coach', 'fullName email');
            // console.log('clients', clients);
            res.status(200).json({ success: true, data: clients });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async addMyClient(req, res) {
        try {
            const { fullName, email } = req.body;
            console.log(req.body);
            const existingClient = await Client.findOne({ email: email });
            if (existingClient) {
                return res.status(400).json({ success: false, message: 'Client already exists and added.' });
            }
            const plainPassword = await generateRandomPassword(10);
            console.log(plainPassword);
            const newClient = new Client({
                fullName,
                email,
                password: plainPassword,
                coach: req.user._id
            });

            await newClient.save();

            const token = jwt.sign({ _id: newClient._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            const loginUrl = `${process.env.BASE_URL}/auth/client/login/${token}`;
            console.log(loginUrl);

            //Your coach, Sarah, has invited you to join the NOWFit platform! Click the button below to get started."
            const html = `<p>Hi , your coach, ${req.user.fullName}, has invited you to join the NOWFit platform! Click the button below to get started.</p>
            <p><a href="${loginUrl}">Go to Login</a></p>`;

            await sendMail(email, html);
            // console.log('Client added successfully');
            return res.status(200).json({ success: true, message: 'Client added successfully' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async allCategoriesForTheCoach(req, res) {
        try {
            const categories = await Category.find({
                $or: [
                    { createdBy: req.user._id, createdByModel: 'coach' },
                    { createdByModel: 'admin' }
                ]
            });
            res.status(200).json({ success: true, data: categories });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }


    async addOrUpdateCategory(req, res) {
        try {
            if (req.body.action === 'add') {
                console.log('add category');
                const { name, type, description } = req.body;
                if (!name || !type || !description) {
                    return res.status(400).json({ success: false, message: 'All fields are required' });
                }
                const newCategory = new Category({ name, type, description, createdBy: req.user._id, createdByModel: 'coach' });
                await newCategory.save();
                return res.status(200).json({ success: true, message: 'Category added successfully' });
            } else if (req.body.action === 'update') {
                console.log('update category');
                const categoryId = req.body.id;
                const { name, type, description } = req.body;
                if (!categoryId || !name || !type || !description) {
                    return res.status(400).json({ success: false, message: 'All fields are required' });
                }
                const updateData = { name, type, description };
                await Category.findByIdAndUpdate(categoryId, updateData);
                return res.status(200).json({ success: true, message: 'Category updated successfully' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async deleteCategory(req, res) {
        try {
            console.log('delete category');
            await Category.findByIdAndDelete(req.body.id);
            return res.status(200).json({ success: true, message: 'Category deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async allWorkoutsForTheCoach(req, res) {
        try {
            const workouts = await Workout.find({
                $or: [
                    { createdBy: req.user._id, createdByModel: 'coach' },
                    { createdByModel: 'admin' }
                ]
            }).populate('category');
            res.status(200).json({ success: true, data: workouts });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async addUpdateWorkout(req, res) {
        try {
            if (req.body.action === 'add') {
                const { name, description, category, status } = req.body;
                if (!name || !description || !category || !status || !req.file) {
                    return res.status(400).json({ error: 'All fields are required' });
                }
                // console.log(req.files.mediaFile[0].filename);
                const newWorkout = new Workout({
                    name, description, category, status,
                    createdBy: req.user._id,
                    createdByModel: 'coach',
                    mediaFile: req.file.mimetype.startsWith('image/') ? '/uploads/photos/' + req.file.filename : '/uploads/videos/' + req.file.filename,
                });
                await newWorkout.save();
                return res.status(200).json({ message: 'Workout added successfully', success: true });
            } else if (req.body.action === 'update') {
                const workoutId = req.body.id;
                const { name, description, category, status } = req.body;

                const updateData = { name, description, category, status };
                if (req.file) {
                    if (req.file.mimetype.startsWith('image/')) {
                        updateData.mediaFile = '/uploads/photos/' + req.file.filename;
                    } else if (req.file.mimetype.startsWith('video/')) {
                        updateData.mediaFile = '/uploads/videos/' + req.file.filename;
                    }
                }
                await Workout.findByIdAndUpdate(workoutId, updateData);
                return res.status(200).json({ message: 'Workout updated successfully', success: true });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}


module.exports = new CoachController();