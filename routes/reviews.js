const express = require('express');
const router = express.Router({ mergeParams: true });

const Review = require("../models/review");
const Listing = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {validatReview,isLoggedIn, isReviewOwner} = require('../middleware')

// const validatReview = (req,res,next)=>{
//   let {error} = reviewSchema.validate(req.body);

//   if(error){
//     let errmsg = error.details.map(el=>el.message.join(","))
//     throw new ExpressError(400, errmsg);
//   }

//   else{
//     next();
//   }
// }


router.post("/",isLoggedIn, validatReview, wrapAsync(async(req,res)=>{
  

  let listing = await Listing.findById(req.params.id);
  let newreview = new Review(req.body.review)
  newreview.author = req.user._id
  //  console.log(req.body);
  listing.reviews.push(newreview)

  await newreview.save();
  await listing.save();

  req.flash("success", "Review  creates successfully")
  res.redirect(`/listings/${listing.id}`)
  
}))

// Review  Delete Review route 
router.delete("/:reviewid",isLoggedIn,isReviewOwner, wrapAsync(async(req,res)=>{
  let {id, reviewid} = req.params;

  await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewid}});

  await Review.findByIdAndDelete(reviewid);

  req.flash('success', "Review Deleted")


  res.redirect(`/listings/${id}`)

}))





module.exports = router;