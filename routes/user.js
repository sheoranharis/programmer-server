const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');
const { find } = require('../models/blog');

router.get('/register', (req, res) => {
    res.render('./users/register')
})

router.post('/register', async(req,res,next) => {
    try{
        const {name, mail, password} = req.body;
        const hash = await bcrypt.hash(password, 12);
        const newUser = new User({
        mail,
        password:hash,
        name
    });
    await newUser.save();
    req.session.userID = newUser._id;
    res.locals.USERID = req.session.userID;
    res.redirect('/blogserver');
    }catch(e){
        next(e);
    }
})

router.get('/login', (req,res) => {
    res.render('./users/login');
})

router.post('/login', async(req,res,next) => {
    try{
        const {mail, password} = req.body;
        const user = await User.findOne({ mail });
  
        if(!user){
            req.flash('error', "Umm try again. No match !!!");
            return res.redirect('/login');
        }

        const validation = await bcrypt.compare(password, user.password);
        if(validation){
            req.session.userID = user._id;
            res.locals.USERID = req.session.userID;
            req.flash("success", "Howdy!!, successfully login");
            res.redirect('/blogserver');
        }
        else{
        req.flash("error", "Not matched, Try Again");
        res.redirect('/login');
    }
    }catch(e){
        next(e);
    }
   
})

router.post('/logout', (req,res) => {
    req.session.userID= null;
    res.redirect('/login');
})


module.exports = router;