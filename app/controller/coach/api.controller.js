const Coach = require('../../model/coach');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Client = require('../../model/client')
const generateRandomPassword = require('../../helper/passwordGenerator')
const { sendMail } = require('../../helper/emailSender');
const Category = require('../../model/category');
const Workout = require('../../model/workouts');
const Recipe = require('../../model/recipe');
const WorkoutProgram = require('../../model/workoutProgram');
const MealPlan = require('../../model/mealPlan');

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
            if (req.query.search) {
                const searchTerm = req.query.search || '';
                let query = {};
                if (searchTerm) {
                    query = {
                        $or: [
                            { name: { $regex: searchTerm, $options: 'i' } },
                            { description: { $regex: searchTerm, $options: 'i' } }
                        ]
                    };
                }
                const workouts = await Workout.find(query)
                if (workouts.length > 0) {
                    return res.status(200).json({ success: true, data: workouts });
                }
            } else {
                const workouts = await Workout.find({
                    $or: [
                        { createdBy: req.user._id, createdByModel: 'coach' },
                        { createdByModel: 'admin' }
                    ]
                }).populate('category');
                res.status(200).json({ success: true, data: workouts });
            }

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

    async allRecipesForTheCoach(req, res) {
        try {
            if (req.query.search) {
                const searchTerm = req.query.search || '';
                let query = {};
                if (searchTerm) {
                    query = {
                        $or: [
                            { name: { $regex: searchTerm, $options: 'i' } },
                            { description: { $regex: searchTerm, $options: 'i' } }
                        ]
                    };
                }
                const recipes = await Recipe.find(query);
                if (recipes.length > 0) {
                    return res.status(200).json({ success: true, data: recipes });
                }
            } else {
                const recipes = await Recipe.find({
                    $or: [
                        { createdBy: req.user._id, createdByModel: 'coach' },
                        { createdByModel: 'admin' }
                    ]
                }).populate('category');
                res.status(200).json({ success: true, data: recipes });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async addUpdateDeleteRecipe(req, res) {
        try {
            if (req.body.action === 'add') {
                const { name, category, nutrition, ingredients, instructions } = req.body;
                if (!name || !category || !nutrition || !ingredients || !instructions) {
                    return res.status(400).json({ error: 'All fields are required' });
                }
                const newRecipe = new Recipe({ name, category, nutrition, ingredients, instructions, createdBy: req.user._id, createdByModel: 'coach' });
                await newRecipe.save();
                return res.status(200).json({ message: 'Recipe added successfully', success: true });
            } else if (req.body.action === 'update') {
                const recipeId = req.body.id;
                const recipe = await Recipe.findById(recipeId);
                if (recipe.createdBy !== req.user._id) {
                    return res.status(403).json({ error: 'You are not authorized to update this recipe' });
                }
                await Recipe.findByIdAndUpdate(recipeId, req.body);
                return res.status(200).json({ message: 'Recipe updated successfully', success: true });

            } else if (req.body.action === 'delete') {
                const recipeId = req.body.id;
                const recipe = await Recipe.findById(recipeId);
                if (recipe.createdBy !== req.user._id) {
                    return res.status(403).json({ error: 'You are not authorized to delete this recipe' });
                }
                await Recipe.findByIdAndDelete(recipeId);
                console.log('recipe deleted');
                return res.status(200).json({ message: 'Recipe deleted successfully', success: true });
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getRecipeById(req, res) {
        try {
            console.log('get recipe by id');
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

    async addProgram(req, res) {
        try {
            // Destructure the required fields from the request body
            const { name, description, duration, schedule } = req.body;

            // Validate required fields
            if (!name || !duration || !schedule || !Array.isArray(schedule) || schedule.length === 0) {
                return res.status(400).json({ success: false, message: 'Name, duration, and schedule are required.' });
            }

            // Create the new workout program
            const newProgram = new WorkoutProgram({
                name,
                description,
                duration,
                schedule,
                createdBy: req.user._id,
                createdByModel: 'coach'
            });

            await newProgram.save();

            return res.status(200).json({
                success: true,
                message: 'Workout program created successfully',
                data: newProgram
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async allProgramsByCoach(req, res) {
        try {
            const programs = await WorkoutProgram.find({ createdBy: req.user._id });
            res.status(200).json({ success: true, data: programs });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    async addMealPlan(req, res) {
        try {
            const { name, dailyPlan, totals, description } = req.body;

            if (!name || !dailyPlan) {
                return res.status(400).json({ success: false, message: 'Name and dailyPlan are required.' });
            }

            const newMealPlan = new MealPlan({
                name,
                dailyPlan,
                totals: totals || {}, // Optional, can be calculated later
                description: description || '',
                createdBy: req.user._id
            });

            await newMealPlan.save();

            res.status(200).json({ success: true, message: 'Meal plan created successfully.', data: newMealPlan });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async allMealPlanByCoach(req, res) {
        try {
            const mealPlans = await MealPlan.find({ createdBy: req.user._id });
            res.status(200).json({ success: true, data: mealPlans });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async allAssignedClientsByCoach(req,res){
        try {
            const clients = await Client.find({ coach: req.params.id }).populate('coach', 'fullName email');
            res.status(200).json({ success: true, data: clients });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    
    async  assignProgramToClient(req, res) {
    try {
        const clientId = req.params.id;
        const templateId = req.body.templateId;
        const client = await Client.findById(clientId);

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        if (req.params.endpoint === 'assign-program') {
            // Prevent duplicates
            const alreadyAssigned = client.assignedWorkoutProgram.some(p => p.programId.toString() === templateId);
            if (!alreadyAssigned) {
                client.assignedWorkoutProgram.push({ programId: templateId });
                await client.save();
            }

            res.status(200).json({ success: true, message: 'Program assigned successfully.' });

        } else if (req.params.endpoint === 'assign-meal-plan') {
            const alreadyAssigned = client.assignedMealPlan.some(p => p.mealPlanId.toString() === templateId);
            if (!alreadyAssigned) {
                client.assignedMealPlan.push({ mealPlanId: templateId });
                await client.save();
            }

            res.status(200).json({ success: true, message: 'Meal plan assigned successfully.' });
        } else {
            res.status(400).json({ error: 'Invalid endpoint' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



}

module.exports = new CoachController();