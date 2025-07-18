const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

const Listing = require("../models/listings");
const {isLoggedIn} = require('../middleware')
const {isOwner} = require('../middleware')
const {validateListing} = require('../middleware')


// const validateListing = (req,res,next)=>{
//   console.log(req.body.listing);
//   let {error} = listingSchema.validate(req.body);

//   if(error){
//     let errmsg = error.details.map((el)=> el.message).join(",");
//     throw new ExpressError(400, errmsg)
//   }
//   else{
//     next();
//   }

// }

// index route
router.get("/", wrapAsync(async(req,res)=>{
 const allListings = await Listing.find({})
 res.render("listings/index", {allListings});
}))


//New route
router.get("/new",isLoggedIn,(req,res)=>{
  
  res.render("listings/new");
})


// edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
  req.flash("error", "Listings you requested doesnot exist")
  res.redirect('/listings')
  }
  res.render('listings/edit', {listing})
}))


// update route
router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(async(req,res)=>{
  let {id} = req.params;
  console.log(req.body.listing);
  if(!req.body ||!req.body.listing){
    throw new ExpressError(404, "Send Data")
  }
  await Listing.findByIdAndUpdate(id, req.body.listing)

  req.flash("success", "Listings updated successfully")
   res.redirect(`/listings/${id}`)
}))

// delete route

router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async(req,res)=>{
  let {id} = req.params;
  let deletelisting = await Listing.findByIdAndDelete(id);
  // console.log(deletelisting);
  req.flash('success', " Listings deleted")
  res.redirect('/listings')
}))
 

// show route
router.get("/:id", wrapAsync(async(req,res)=>{
  let {id} = req.params;
  
  const listing = await Listing.findById(id).populate({
    path:'reviews',
    populate:{
      path:"author"
    }
  }).populate('owner');
  if(!listing){
    req.flash("error", "Listings you requeested doesnot exist")
    res.redirect('/listings')
  }
  res.render("listings/show", {listing})
}))



router.post("/", isLoggedIn,  validateListing, wrapAsync(async(req,res, next)=>{
 

 const newlisting = new Listing(req.body.listing)
 newlisting.owner = req.user._id
 
 await newlisting.save();
  req.flash("success", "Listing is created successfully")
  res.redirect("/listings");

}))




module.exports = router;