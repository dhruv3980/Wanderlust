const express = require('express');
const router = express.Router();
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware')
const {signUpFormShow, signUp, loginFormRender, login, logOut} = require('../controllers/user')

router.route('/signup')
.get(signUpFormShow)
.post( signUp)



router.route('/login')
.get(loginFormRender)
.post( saveRedirectUrl,passport.authenticate('local', {failureRedirect:'/login', failureFlash:true}),login)

router.get('/logout',logOut)
module.exports= router;