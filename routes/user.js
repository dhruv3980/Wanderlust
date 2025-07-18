const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware')

router.get('/signup', (req,res)=>{
    res.render('listings/signup.ejs')
})

router.post('/signup', async(req,res)=>{
    try{

        let {userName , email , password} = req.body;
        if(!(userName && email && password)){
            throw new Error("data missing of signup")

        }

        const user = new User ({ username:userName, email:email})
        const registeruser = await User.register(user, password)

        req.login(registeruser, (err)=>{
            if(err){
                return next(err)
            }
            req.flash('success', "User is registered successfully");
            res.redirect('/listings')
        }) 
        

    } catch(e){
        req.flash('error', e.message);
        res.redirect('/signup')

    }
})

router.get('/login',(req,res)=>{
    res.render('listings/login')
})

router.post('/login', saveRedirectUrl, passport.authenticate('local', 
    {
    failureRedirect:'/login', 
    failureFlash:true
    }),
     async(req,res)=>{
    req.flash('success', "User logged in successfully");
    console.log(req.userName);
    let redirecturl = res.locals.redirectUrl ||'/listings'
    res.redirect(redirecturl);


})

router.get('/logout', (req,res,next)=>{
    req.logout(err=>{
        console.log(err)
        if(err){
             return next(err)

        }
        req.flash('success', "You are logged out");
        res.redirect('/listings');
    })
})
module.exports= router;