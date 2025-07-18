const User = require('../models/user')

exports.signUpFormShow = (req,res)=>{
    res.render('listings/signup.ejs')
}

exports.signUp = async(req,res)=>{
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
}

exports.loginFormRender = (req,res)=>{
    res.render('listings/login')
}

exports.login = async(req,res)=>{
    req.flash('success', "User logged in successfully");
    console.log(req.userName);
    let redirecturl = res.locals.redirectUrl ||'/listings'
    res.redirect(redirecturl);

}

exports.logOut =  (req,res,next)=>{
    req.logout(err=>{
        console.log(err)
        if(err){
             return next(err)

        }
        req.flash('success', "You are logged out");
        res.redirect('/listings');
    })
}