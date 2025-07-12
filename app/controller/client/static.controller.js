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
}

module.exports = new StaticController();