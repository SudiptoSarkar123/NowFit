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
const mongoose = require('mongoose');
const Habit = require('../../model/dailyHabits');

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
            const loginUrl = `${process.env.BASE_URL}/auth/client/login`;
            console.log(loginUrl);

            //Your coach, Sarah, has invited you to join the NOWFit platform! Click the button below to get started."
            const html = `<p>Hi , your coach, ${req.user.fullName}, has invited you to join the NOWFit platform! </p>
            <p>Your Username: ${email}</p>
            <p>Your Password: ${plainPassword}</p>
            <p>Here is your login link: <a href="${loginUrl}">${loginUrl}</a></p>`;

            await sendMail(email, html);
            // console.log('Client added successfully');
            return res.status(200).json({ success: true, message: 'Client added successfully' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async getClientById(req, res) {
        try {
            const clientId = req.params.id;
            const client = await Client.findById(clientId).populate('coach', 'fullName email')
                .populate('assignedWorkoutProgram.programId', 'name').populate('assignedMealPlan.mealPlanId', 'name');
            res.status(200).json({ success: true, data: client });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async unassignMealPlan(req, res) {
        try {
            const { clientId } = req.params;

            // Find the client
            const client = await Client.findById(clientId);
            if (!client) {
                return res.status(404).json({ success: false, message: 'Client not found' });
            }

            // SECURITY CHECK: Make sure the coach owns this client
            if (!client.coach.equals(req.user.id)) {
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }

            client.assignedMealPlan = null;

            // Save the parent document. Mongoose will remove the field from the database.
            await client.save();

            console.log(`Meal plan unassigned for client ${clientId}`);
            res.status(200).json({ success: true, message: 'Meal plan unassigned successfully.' });

        } catch (error) {
            // This is where your previous error was caught.
            console.error('Error in unassignMealPlan:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
    async unassignProgram(req, res) {
        try {
            const { clientId } = req.params;
            const { assignmentId } = req.body; // This is the _id of the object inside the array

            if (!mongoose.Types.ObjectId.isValid(clientId) || !mongoose.Types.ObjectId.isValid(assignmentId)) {
                return res.status(400).json({ success: false, message: 'Invalid ID format provided.' });
            }

            const client = await Client.findById(clientId).select('coach'); // Only fetch the coach field for efficiency
            if (!client) {
                return res.status(404).json({ success: false, message: 'Client not found.' });
            }

            // --- SECURITY CHECK ---
            if (!client.coach.equals(req.user.id)) {
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }


            const updatedClient = await Client.findOneAndUpdate(
                { _id: clientId },
                {
                    $pull: {
                        assignedWorkoutProgram: {
                            programId: assignmentId
                        }
                    }
                },
                { new: true }
            );

            // 4. --- Check if the update was successful ---
            // If findOneAndUpdate returns null, it means the client wasn't found.
            if (!updatedClient) {
                return res.status(404).json({ success: false, message: 'Client not found or assignment could not be removed.' });
            }

            // 5. --- Send Success Response ---
            res.status(200).json({
                success: true,
                message: 'Workout program removed successfully.'
            });

        } catch (error) {
            console.error('Error removing workout program:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
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
            console.log(totals)

            const newMealPlan = new MealPlan({
                name,
                dailyPlan,
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

    async allProgramsForTheClient(req, res) {
        try {
            const clientId = req.params.clientId;
            // console.log('Fetching assignments for clientId:', clientId);

            // --- 2. Use findById to get ONE client, not find() ---
            const client = await Client.findById(clientId)
                // --- 3. CORRECTLY POPULATE THE NESTED FIELDS ---
                // To populate the array of workouts:
                .populate({
                    path: 'assignedWorkoutProgram.programId', // The path to the ObjectId you want to populate
                    select: 'name' // Only get the 'name' field from the WorkoutProgram document
                })
                // To populate the single meal plan:
                .populate({
                    path: 'assignedMealPlan.mealPlanId', // The path to the ObjectId
                    select: 'name' // Only get the 'name' field
                });

            // --- 4. Handle the case where the client is not found ---
            if (!client) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found.'
                });
            }

            console.log('Found client with populated plans:', client);

            // --- 5. Send a structured response containing ONLY the assignments ---
            // Your frontend function expects an object with these two keys.
            const assignments = {
                assignedWorkoutProgram: client.assignedWorkoutProgram,
                assignedMealPlan: client.assignedMealPlan
            };

            res.status(200).json({
                success: true,
                data: assignments // Send the extracted assignment object
            });

        } catch (error) {
            console.error('Error fetching client assignments:', error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    };


    async assignProgramToClient(req, res) {
        console.log('assignProgramToClient');
        try {
            const { clientId, type } = req.params; // Get both client ID and type from the URL
            const { templateId } = req.body;

            // 1. --- Initial Validations ---
            if (!templateId) {
                return res.status(400).json({ success: false, message: 'Template ID is required.' });
            }

            const client = await Client.findById(clientId);
            if (!client) {
                return res.status(404).json({ success: false, message: 'Client not found.' });
            }


            if (type === 'assign-program') {
                const programTemplate = await WorkoutProgram.findById(templateId);
                if (!programTemplate) {
                    return res.status(404).json({ success: false, message: 'Workout program template not found.' });
                }

                // Prevent adding the same program twice
                const isAlreadyAssigned = client.assignedWorkoutProgram.some(p => p.programId.equals(templateId));
                if (isAlreadyAssigned) {
                    return res.status(400).json({ success: false, message: 'This program is already assigned to the client.' });
                }

                // Push to the array
                client.assignedWorkoutProgram.push({ programId: templateId });
                await client.save();

                return res.status(200).json({ success: true, message: 'Workout program assigned successfully.' });
            }

            // ===================================
            // ELSE IF a Meal Plan is being assigned
            // ===================================
            else if (type === 'assign-meal-plan') {
                const mealPlanTemplate = await MealPlan.findById(templateId);
                if (!mealPlanTemplate) {
                    return res.status(404).json({ success: false, message: 'Meal plan template not found.' });
                }

                // Set the single object (this replaces any existing plan)
                client.assignedMealPlan = { mealPlanId: templateId };
                await client.save();

                return res.status(200).json({ success: true, message: 'Meal plan assigned successfully.' });
            }

            // ===================================
            // ELSE, the 'type' in the URL is invalid
            // ===================================
            else {
                return res.status(400).json({ success: false, message: 'Invalid assignment type specified in URL.' });
            }

        } catch (error) {
            console.error('Error in assignment:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }

    async allHabits(req, res) {
        try {
            const habits = await Habit.find({ createdBy: req.user._id });
            res.status(200).json({ success: true, data: habits });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async addEditHabit(req, res) {
        try {
            if (req.body.action === 'add') {
                const { title, description } = req.body;
                if (!title) {
                    return res.status(400).json({ success: false, message: 'Title is required' });
                }
                const newHabit = new Habit({ title, description, createdBy: req.user._id });
                await newHabit.save();
                res.status(200).json({ success: true, data: newHabit });
            } else if (req.body.action === 'update') {
                const { id, title, description } = req.body;
                if (!id) {
                    return res.status(400).json({ success: false, message: 'Id is required' });
                }
                const updateData = { title, description };
                await Habit.findByIdAndUpdate(id, updateData);
                res.status(200).json({ success: true, message: 'Habit updated successfully' });
            } else if (req.body.action === 'delete') {
                const { id } = req.body;
                if (!id) {
                    return res.status(400).json({ success: false, message: 'Id is required' });
                }
                await Habit.findByIdAndDelete(id);
                res.status(200).json({ success: true, message: 'Habit deleted successfully' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    // async allHabitsByClient(req, res) {
    //     try {
    //         const { clientId } = req.params;
    //         if (!clientId) {
    //             return res.status(400).json({ success: false, message: 'Client Id is required' });
    //         }
    //         const client = await Client.findById(clientId)
    //             .populate('dailyHabits.habitId')
    //             .select('fullName email dailyHabits');

    //         if (!client) {
    //             return res.status(404).json({ message: 'Client not found' });
    //         }

    //         console.log('habits', habits);
    //         res.status(200).json({
    //             message: 'Client habit fetched successfully',
    //             clientHabit: client.dailyHabits,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ success: false, message: 'Internal server error' });
    //     }
    // }

    



}

module.exports = new CoachController();