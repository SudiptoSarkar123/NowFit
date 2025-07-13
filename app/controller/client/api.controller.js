const Client = require('../../model/client');
const MealPlan = require('../../model/mealPlan');
class ClintApiController {
    async getDashboardData(req, res) {
       try {
        const clientId = req.user._id; 
        
        if (!clientId) {
            return res.status(401).json({ success: false, message: 'Not authorized.' });
        }

        // --- The DEEPLY POPULATED Database Query ---
        const clientData = await Client.findById(clientId)
            .select('-password')
            .populate({
                path: 'coach',
                select: 'fullName avatarUrl'
            })
            .populate({
                path: 'assignedWorkoutProgram.programId',
                model: 'WorkoutProgram', // Explicitly specify the model for clarity
                populate: {
                    // This is the nested populate
                    path: 'schedule.exercises.exerciseId',
                    model: 'workout', 
                    select: 'name videoUrl instructions'
                }
            })
            .populate({
                path: 'assignedMealPlan.mealPlanId',
                model: 'MealPlan', // Explicitly specify the model
                populate: [
                    { path: 'dailyPlan.breakfast', model: 'Recipe', select: 'name instructions' },
                    { path: 'dailyPlan.lunch', model: 'Recipe', select: 'name instructions' },
                    { path: 'dailyPlan.dinner', model: 'Recipe', select: 'name instructions' },
                    { path: 'dailyPlan.snacks', model: 'Recipe', select: 'name instructions' }
                ]
            });

        if (!clientData) {
            return res.status(404).json({ success: false, message: 'Client profile not found.' });
        }
        
        res.status(200).json({
            success: true,
            data: clientData
        });

    } catch (error) {
        console.error('Error fetching client dashboard data:', error);
        res.status(500).json({
            success: false,
            message: 'An internal server error occurred.'
        });
    }
    }

    async updateAvatar(req, res) {
        try {
            console.log('update avatar');
           if(req.file){
               await Client.findByIdAndUpdate(req.user._id, { 
                avatarUrl:  '/uploads/photos/' + req.file.filename , 
             });
               res.status(200).json({ message: 'Avatar updated successfully', success: true });
           }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async updateProfileDetails(req,res){
         try {
        const client = await Client.findById(req.user._id);

        if (client) {
            // Update fields from the request body. Only update what's provided.
            client.fullName = req.body.fullName || client.fullName;
            client.gender = req.body.gender || client.gender;
            client.height = req.body.height || client.height;
            client.weight = req.body.weight || client.weight;
            client.age = req.body.age || client.age;
            client.phoneNumber = req.body.phoneNumber || client.phoneNumber;
            client.address = req.body.address || client.address;
            client.city = req.body.city || client.city;

            const updatedClient = await client.save();

            res.json({
                success: true,
                message: 'Profile updated successfully.',
                data: {
                    fullName: updatedClient.fullName // Send back any relevant data
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'Client not found' });
        }
    } catch (error) {
        console.error('Error updating profile details:', error);
        res.status(500).json({ success: false, message: 'Server error while updating profile.' });
    }
    }

    async getMyMealPlans(req,res){
         try {
        const mealPlanId = req.params.id;

        const mealPlan = await MealPlan.findById(mealPlanId)
            .populate('createdBy') // Optional: only if you want coach details
            .populate('dailyPlan.breakfast')
            .populate('dailyPlan.lunch')
            .populate('dailyPlan.dinner')
            .populate('dailyPlan.snacks');

        if (!mealPlan) {
            return res.status(404).json({ success: false, message: "Meal plan not found" });
        }

        res.status(200).json({ success: true, data: mealPlan });
    } catch (error) {
        console.error("Error fetching meal plan:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
    }
}

module.exports = new ClintApiController();