class StaticController {
 
    async loginPg(req,res) {
        try {
            res.render('admin/login', { title: 'Admin Login' });    
        } catch (error) {
            console.error('Error rendering login page:', error);
            res.status(500).send('Internal Server Error');
        }
    }


    async adminDashboardPg(req,res){
        try {
            res.render('admin/AdminDash',{title:'Admin Dashboard'})
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error:'Internal Server Error'
            })
        }
    }

    async coachMgtPg(req,res){
        try {
            res.render('admin/coachMgt',{title:'Trainer Management'})
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error:'Internal Server Error'
            })
        }
    }

    async clientMgtPg(req,res){
        try {
            res.render('admin/clientMgt',{title:'Client Management'})
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error:'Internal Server Error'
            })
        }
    }
    async packageMgtPg(req,res){
        try {
            res.render('admin/packageMgt',{title:'Package Management'})
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error:'Internal Server Error'
            })
        }
    }


    async workoutLibraryPg(req,res){
        try {
            return res.render('admin/workoutLibrary',{title:'Workout Library'})
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error:'Internal Server Error'
            })
        }
    }

    async enquiryMgtPg(req,res){
        try {
            res.render('admin/enquiryMgt',{title:'Enquiry Management'})
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error:'Internal Server Error'
            })
        }
    }


    async categoryMgtPg(req,res){
        try {
            res.render('admin/categoryMgt',{title:'Category Management'})
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error:'Internal Server Error'
            })
        }
    }


    async recipeMgtPg(req,res){
        try {
            res.render('admin/recipeMgt',{title:'Recipe Management'})
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error:'Internal Server Error'
            })
        }
    }

    async transactionMgtPg(req,res){
        try {
            res.render('admin/transactionMgt',{title:'Transaction Management'})
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error:'Internal Server Error'
            })
        }
    }


    async cmsMgt(req,res){
        try {
            return res.render('admin/cmsMgt',{title:'CMS Management'})
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error:'Internal Server Error'
            })
        }
    }
 
}


module.exports = new StaticController();