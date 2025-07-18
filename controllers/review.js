const Listing = require('../models/listings')
const Review = require('../models/review')

exports.createReview = async(req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let newreview = new Review(req.body.review)
  newreview.author = req.user._id
  //  console.log(req.body);
  listing.reviews.push(newreview)

  await newreview.save();
  await listing.save();

  req.flash("success", "Review  creates successfully")
  res.redirect(`/listings/${listing.id}`)
  
}


exports.destroyReview = async(req,res)=>{
  let {id, reviewid} = req.params;

  await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewid}});

  await Review.findByIdAndDelete(reviewid);

  req.flash('success', "Review Deleted")


  res.redirect(`/listings/${id}`)

}
