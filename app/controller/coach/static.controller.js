const Coach = require('../../model/coach');


class StaticController {
  async loginPg(req, res) {
    try {
      res.render('coach/login', { title: 'Coach Login' });
    } catch (error) {
      console.error('Error rendering login page:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async changePasswordPg(req, res) {
    try {
      res.render('coach/changePassword', { title: 'Change Password' });
    } catch (error) {
      console.error('Error rendering login page:', error);
      res.status(500).send('Internal Server Error');
    }
  }


// window.location.href = `/auth/coach/onboarding/${response.firstLogin}`; 
  async onboardingPg(req, res) {
    try {
      return res.render('coach/onboarding', { title: 'Onboarding' });
    } catch (error) {
      console.error('Error rendering login page:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async dashboardPg(req, res) {
    try {
      return res.render('coach/dashboard', { title: `Welcome ${req.user.name} Dashboard` })
    } catch (error) {
      console.log(error);
      return res.status(500).send('Internal Server Error');
    }
  }

  async clientMgtPg(req,res){
    try {
      return res.render('coach/clientMgt',{title:'Client Management'})
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error:'Internal Server Error'
        })
    }
  }

  async categoryMgtPg(req,res){
    try {
      return res.render('coach/categoryMgt',{title:'Category Management'})      
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error:'Internal Server Error'
        })      
    }
  }
  async workoutMgtPg(req,res){
    try {
      return res.render('coach/workoutMgt',{title:'Workout Management'})
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error:'Internal Server Error'
        })
    }
  }
  async recipeMgtPg(req,res){
    try {
      return res.render('coach/recipeMgt',{title:'Recipe Management'})
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error:'Internal Server Error'
        })
    }
  }

}

module.exports = new StaticController();