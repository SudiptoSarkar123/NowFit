const Admin = require('../../model/admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Coach = require('../../model/coach')
const Client = require('../../model/client');
const Package = require('../../model/package');
const Workout = require('../../model/workouts');
const Enquiry = require('../../model/enquiry');
const Category = require('../../model/category');
const Recipe = require('../../model/recipe');
const { sendMail } = require('../../helper/emailSender');
const generateRandomPassword = require('../../helper/passwordGenerator');
const Transaction = require('../../model/transaction');

class AdminController {
    async allCoaches(req, res) {
        try {
            const coaches = await Coach.find({});
            // console.log(coaches)
            res.status(200).json({
                data: coaches,
                message: 'Coaches fetched successfully',
                success: true
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    async blockCoach(req, res) {
        try {
            const coachId = req.params.id;
            console.log('hiihih');
            console.log(req.params.id);
            await Coach.findByIdAndDelete(coachId);
            console.log('Coach blocked successfully');
            res.status(200).json({ message: 'Coach blocked successfully', success: true })

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });

        }
    }

    async updateCoach(req, res) {
        try {
            const coachId = req.params.id;
            console.log('ooohih');
            console.log(req.params.id);
            await Coach.findByIdAndUpdate(coachId, req.body)
            console.log('Coach updated successfully');
            res.status(200).json({ message: 'Trainer updated successfully', success: true })
        } catch (error) {
            req.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async addCoach(req, res) {
        try {
            console.log('ADD COACH');
            const { fullName, email, password } = req.body;
            if (!fullName || !email || !password) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            
            const coach = new Coach({ fullName, email, password });
            await coach.save();

            const loginUrl = `http://localhost:3000/auth/coach/login`;
            const html = `<p>Hi ${fullName},</p>
            <p>Your Username: ${email}</p>
            <p>Your Password: ${password}</p>
            <p>Here is your login link: <a href="${loginUrl}">${loginUrl}</a></p>`;
            
            await sendMail(email, html);

            res.status(200).json({ message: 'Coach added successfully', success: true })
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    async allClients(req, res) {
        try {
            // console.log('clients')
            const clients = await Client.find({}).populate('coach', 'fullName email'); // Populate coach details
            // console.log(clients);
            res.status(200).json({
                data: clients,
                message: 'Clients fetched successfully',
                success: true
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async addClient(req, res) {
        try {
            // console.log('ADD Clients');
            // console.log(req.body);
            const { fullName, email, password, coach } = req.body;
            if (!fullName || !email || !password || !coach) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            // Check if client already exists
            const existingClient = await Client.findOne({ email });
            if (existingClient) {
                return res.status(409).json({ error: 'Client with this email already exists.' });
            }

            // Hash the password
            const hashedPassword = bcrypt.hashSync(password, 10);


            // Create new client
            const newClient = new Client({
                fullName,
                email,
                password: hashedPassword,
                coach
            });

            await newClient.save();

            return res.status(201).json({ message: 'Client added successfully', success: true })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async blockClient(req, res) {
        try {
            const clientId = req.params.id;
            console.log('hiihih');
            console.log(req.params.id);
            await Client.findByIdAndUpdate(clientId, { status: 'blocked' });
            console.log('client blocked successfully');
            res.status(200).json({ message: 'client blocked successfully', success: true })

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });

        }
    }

    async updateClient(req, res) {
        try {
            const clientId = req.params.id;
            console.log('update client');
            // console.log(req.params.id);
            await Client.findByIdAndUpdate(clientId, req.body)
            console.log('Client updated successfully');
            res.status(200).json({ message: 'Client updated successfully', success: true })
        } catch (error) {
            req.status(500).json({ error: 'Internal Server Error' });
        }
    }



    async allPackages(req, res) {
        try {
            const allPackages = await Package.find({});
            console.log(allPackages);
            return res.status(200).json({
                data: allPackages,
                message: 'Packages fetched successfully',
                success: true
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    async addPackage(req, res) {
        try {
            const { name, price, duration, description } = req.body;
            if (!name || !price || !duration || !description) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            const newPackage = new Package({ name, price, duration, description });
            await newPackage.save();
            return res.status(200).json({ message: 'Package added successfully', success: true })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async updatePackage(req, res) {
        try {
            const packageId = req.params.id;
            console.log(req.params.id);
            await Package.findByIdAndUpdate(packageId, req.body)
            console.log('Package updated successfully');
            return res.status(200).json({ message: 'Package updated successfully', success: true })
        } catch (error) {
            console.log(error);
            return req.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async blockPackage(req, res) {
        try {
            const packageId = req.params.id;
            await Package.findByIdAndUpdate(packageId, { status: 'inactive' });
            console.log('Package blocked successfully');
            return res.status(200).json({ message: 'Package blocked successfully', success: true })

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });

        }
    }

    async allWorkouts(req, res) {
        try {
            // Fetch all workouts and populate the category field
            const workouts = await Workout.find({}).populate('category');
            res.status(200).json({
                data: workouts,
                message: 'Workouts fetched successfully',
                success: true
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }

    }

    async addUpdateWorkout(req, res) {
        if (req.body.action === 'add') {
            try {
                const { name, description, category, status } = req.body;
                if (!name || !description || !category || !status || !req.file) {
                    return res.status(400).json({ error: 'All fields are required' });
                }
                // console.log(req.files.mediaFile[0].filename);
                const newWorkout = new Workout({
                    name, description, category, status, 
                    createdBy: req.user._id,
                    createdByModel: 'admin',
                    mediaFile: req.file.mimetype.startsWith('image/') ? '/uploads/photos/' + req.file.filename : '/uploads/videos/' + req.file.filename,
                });
                await newWorkout.save();
                return res.status(200).json({ message: 'Workout added successfully', success: true });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Internal Server Error' });
            };

        } else if (req.body.action === 'update') {
            try {
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
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }

    async getWorkoutById(req, res) {
        try {
            const workoutId = req.params.id;
            const workout = await Workout.findById(workoutId);
            if (!workout) {
                return res.status(404).json({ error: 'Workout not found' });
            }
            return res.status(200).json({
                data: workout,
                message: 'Workout fetched successfully',
                success: true
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteWorkout(req, res) {
        try {
            const workoutId = req.params.id;
            if (!workoutId) {
                return res.status(400).json({ error: 'Workout ID is required' });
            }
            await Workout.findByIdAndDelete(workoutId);
            return res.status(200).json({ message: 'Workout deleted successfully', success: true });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    async allEnquiries(req, res) {
        try {
            const enquiries = await Enquiry.find({}).sort({ receivedAt: -1 }); // Sort by receivedAt in descending order
            res.status(200).json({
                data: enquiries,
                message: 'Enquiries fetched successfully',
                success: true
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async addEnquiry(req, res) {
        try {
            
            const { fullName, email, contactNumber, clientCount, howHeard, optionalMessage } = req.body;

        
            if (!fullName || !email) {
                return res.status(400).json({ message: 'Full name and email are required fields.' });
            }

         
            const newEnquiry = new Enquiry({
                fullName,
                email,
                contactNumber: contactNumber || null, // Ensure empty strings become null
                clientCount: clientCount || null,
                howHeard: howHeard || null,
                optionalMessage: optionalMessage || null
            });

        
            const savedEnquiry = await newEnquiry.save();

           
            res.status(201).json({ 
                message: 'Enquiry submitted successfully!', 
                enquiry: savedEnquiry 
            });

        } catch (error) {
            console.error('Error adding enquiry:', error); // Log the full error for debugging

            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: 'Validation failed. Please check your data.', details: error.errors });
            }

            
            res.status(500).json({ message: 'An internal server error occurred. Please try again later.' });
        }
    }

    async markEnquiryAsContacted(req, res) {
        try {
            const enquiryId = req.body.id;
            if (!enquiryId) {
                return res.status(400).json({ error: 'Enquiry ID is required' });
            }
            await Enquiry.findByIdAndUpdate(enquiryId, { status: 'Contacted' });
            return res.status(200).json({ message: 'Enquiry marked as contacted', success: true });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

    }

    async deleteEnquiry(req, res) {
        try {
            const enquiryId = req.body.id;
            if (!enquiryId) {
                return res.status(400).json({ error: 'Enquiry ID is required' });
            }
            await Enquiry.findByIdAndDelete(enquiryId);
            return res.status(200).json({ message: 'Enquiry deleted successfully', success: true });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async allCategories(req, res) {
        try {
            const categories = await Category.find({});
            // console.log('Categories:', categories);
            return res.status(200).json({
                data: categories,
                message: 'Categories fetched successfully',
                success: true
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async addOrUpdateCategory(req, res) {
        if (req.body.action === 'add') {
            try {
                const { name, type, description } = req.body;
                if (!name || !type || !description) {
                    return res.status(400).json({ error: 'All fields are required' });
                }
                const newCategory = new Category({ name, type, description , createdBy: req.user._id, createdByModel: 'admin' });
                await newCategory.save();
                return res.status(200).json({ message: 'Category added successfully', success: true });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        } else if (req.body.action === 'update') {
            try {
                const categoryId = req.body.id;
                const { name, type, description } = req.body;
                if (!categoryId || !name || !type || !description) {
                    return res.status(400).json({ error: 'All fields are required' });
                }
                const updateData = { name, type, description };
                await Category.findByIdAndUpdate(categoryId, updateData);
                return res.status(200).json({ message: 'Category updated successfully', success: true });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        } else if (req.body.action === 'update_status') {
            try {
                console.log('req.body', req.body);
                const categoryId = req.body.id;
                if (!categoryId) {
                    return res.status(400).json({ error: 'Category ID is required' });
                }
                const newStatus = req.body.status;
                await Category.findByIdAndUpdate(categoryId, { status: newStatus });
                console.log(`Category ${newStatus} successfully`);
                return res.status(200).json({ message: `Category ${newStatus} successfully`, success: true });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }


    async allRecipes(req, res) {
        try {
            const recipes = await Recipe.find({}).populate('category').sort({ createdAt: -1 });
            // console.log('Recipes:', recipes);
            res.status(200).json({
                data: recipes,
                message: 'Recipes fetched successfully',
                success: true
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async addUpdateDeleteRecipe(req, res) {
        try {
            if (req.body.action === 'add') {
                console.log('req.body', req.body);
                const { name, category, nutrition, ingredients, instructions } = req.body;
                if (!name || !category || !nutrition || !ingredients || !instructions) {
                    return res.status(400).json({ error: 'All fields are required' });
                }
                const newRecipe = new Recipe({ name, category, nutrition, ingredients, instructions ,
                     createdBy: req.user._id, createdByModel: 'admin' });
                await newRecipe.save();
                return res.status(200).json({ message: 'Recipe added successfully', success: true });
            } else if (req.body.action === 'update') {
                const recipeId = req.body.id;
                await Recipe.findByIdAndUpdate(recipeId, req.body);
                return res.status(200).json({ message: 'Recipe updated successfully', success: true });
            } else if (req.body.action === 'delete') {
                const recipeId = req.body.id;
                console.log(recipeId);
                await Recipe.findByIdAndDelete(recipeId);
                return res.status(200).json({ message: 'Recipe deleted successfully', success: true });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getRecipeById(req, res) {
        try {
            const recipeId = req.params.id;
            const recipe = await Recipe.findById(recipeId).populate('category');
            if (!recipe) {
                return res.status(404).json({ error: 'Recipe not found' });
            }
            res.status(200).json({
                data: recipe,
                message: 'Recipe fetched successfully',
                success: true
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }



    // async allTransactionsByFillter(req, res) {
    //     try {
    //         const { startDate, endDate, coachId } = req.query;
    //         const filter = {};

    //         if (startDate) filter.createdAt = { ...filter.createdAt, $gte: new Date(startDate) };
    //         if (endDate) filter.createdAt = { ...filter.createdAt, $lte: new Date(endDate) };
    //         if (coachId) filter.coach = coachId;

    //         // Populate client and coach for display
    //         const transactions = await Transaction.find(filter)
    //             .populate('client')
    //             .populate('coach')
    //             .sort({ createdAt: -1 });
    //         console.log('Transactions:', transactions);
    //         res.json({ success: true, data: transactions });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ success: false, error: 'Internal Server Error' });
    //     }
    // }

  
}

module.exports = new AdminController();