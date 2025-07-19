if(process.env.NODE_ENV!= 'production'){
    require('dotenv').config()
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require('express-session');
const flash = require('connect-flash');

const User = require('./models/user.js')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const signupRouter = require('./routes/user.js')

const dbUrl = "mongodb://127.0.0.1:27017/wanderlust";


main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const options = {
    secret:"namastey",
    resave:false,
    saveUninitialized:true,

    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxage:7*24*60*60*1000,
        httpOnly:true,
    }
}

app.use(session(options));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentuser = req.user;
    next();
})



app.get("/", (req, res) => {
    res.redirect("/listings");
});





app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use('/', signupRouter)

app.get('/search', (req, res) => {
    let { q } = req.query;
    console.log("Search query:", q);

    // Set flash message for the next request
    req.flash("error", `Oops! Search functionality is coming soon. Thanks for your patience! you can expore using icons`);


    // Redirect to homepage or listings page
    res.redirect('/listings');
});



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})


app.use((err, req, res, next) => {
    let { statusCode=500, message="Something went wrong!" } = err;
    res.status(statusCode).render("listings/error.ejs", { err });
    // res.status(statusCode).send(message);
});




app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
