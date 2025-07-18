const Listing = require('./models/listings')
const {listingSchema,reviewSchema} = require('./schema')
const Review = require('./models/review')


exports.isLoggedIn = (req, res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash('error', " You must be logged in to create listings");
        return res.redirect('/login');
    }
    next();
}

exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl
    }
    next()
}


exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listings = await Listing.findById(id);
    if(!res.locals.currentuser._id.equal(listings.owner._id)){
        req.flash('error', "You are not the owner of the lisitnds");
       return res.redirect(`/listing/${id}`)

    }
    next();
}



exports.validateListing = (req,res,next)=>{
  console.log(req.body.listing);
  let {error} = listingSchema.validate(req.body);

  if(error){
    let errmsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400, errmsg)
  }
  else{
    next();
  }

}


exports.validatReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);

  if(error){
    let errmsg = error.details.map(el=>el.message.join(","))
    throw new ExpressError(400, errmsg);
  }

  else{
    next();
  }
}

exports.isReviewOwner = async(req,res,next)=>{
    let {id, reviewid} = req.params;
    let Review = await Review.findById(id);
    if(!res.locals.currentuser._id.equal(Review.author._id)){
        req.flash('error', "Only the owner can modify this review.");
        return res.redirect(`/listing/${id}`)

    }
    next();
}