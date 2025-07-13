class StaticController{
    async clientDashboardPg(req,res) {
        try {
            res.render('client/dashboard',{title:'Client Dashboard'})
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error:'Internal Server Error'
            })
        }
    }

    async loginPg(req,res) {
        try {
            res.render('client/login',{title:'Client Login'})
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error:'Internal Server Error'
            })
        }
    }

    async clientProfilePg(req,res) {
        try {
            res.render('client/profile',{title:'Client Profile'})
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error:'Internal Server Error'
            })
        }
    }

    async clientMealPlanPg(req,res){
        try {
            res.render('client/mealPlan',{title:'Client Meal Plan'})
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error:'Internal Server Error'
            })
        }
    }

    async clientWorkoutPg(req,res){
        try {
            res.render('client/workoutPlan',{title:'Client Workout'})
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error:'Internal Server Error'
            })
        }
    }
}

module.exports = new StaticController();