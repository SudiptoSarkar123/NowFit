class publicController {
    
    async publicLandingPg(req, res) {
        try {
            res.render('public/index', { title: 'Public Landing' });    
        } catch (error) {
            console.error('Error rendering login page:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new publicController();