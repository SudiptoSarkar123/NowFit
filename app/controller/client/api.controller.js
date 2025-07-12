const Client = require('../../model/client');
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
}

module.exports = new ClintApiController();