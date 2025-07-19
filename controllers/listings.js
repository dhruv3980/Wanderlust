const Listing = require('../models/listings')

exports.index = async(req,res)=>{
 const allListings = await Listing.find({})
 res.render("listings/index", {allListings});
}

exports.newListingsForm = (req,res)=>{
  
  res.render("listings/new");
}

exports.editListing = async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
  req.flash("error", "Listings you requested doesnot exist")
  res.redirect('/listings')
  }
  let originalImageUrl =  listing.image.url;
  originalImageUrl.replace('/upload','/upload/ w_250');

  res.render('listings/edit', {listing, originalImageUrl})
}

exports.updateListing = async(req,res)=>{
  let {id} = req.params;
 
  console.log(req.body.listing);
  if(!req.body ||!req.body.listing){
    throw new ExpressError(404, "Send Data")
  }
 let listing = await Listing.findByIdAndUpdate(id, req.body.listing)
  if(typeof req.file!=='undefined'){
    const url = req.file.path;
    const filename = req.file.filename

    listing.image = {url, filename}
    await listing.save();
  }

  req.flash("success", "Listings updated successfully")
   res.redirect(`/listings/${id}`)
}

exports.deleteListing = async(req,res)=>{
  let {id} = req.params;
  let deletelisting = await Listing.findByIdAndDelete(id);
  // console.log(deletelisting);
  req.flash('success', " Listings deleted")
  res.redirect('/listings')
}

exports.detailsOfTheListings = async(req,res)=>{
  let {id} = req.params;
  
  const listing = await Listing.findById(id).populate({
    path:'reviews',
    populate:{
      path:"author"
    }
  }).populate('owner');
  if(!listing){
    req.flash("error", "Listings you requested doesnot exist")
    res.redirect('/listings')
  }
  res.render("listings/show", {listing})
}

exports.createListing = async(req,res, next)=>{
 
const url = req.file.path;
const filename = req.file.filename

 const newlisting = new Listing(req.body.listing)
 newlisting.image = {url,filename}
 newlisting.owner = req.user._id
 
 await newlisting.save();
  req.flash("success", "Listing is created successfully")
  res.redirect("/listings");

}

exports.filterListings = async (req, res, next) => {
    const { q } = req.params;
    const filteredListings = await Listing.find({category: q }).exec();
    if (!filteredListings.length) {
        req.flash("error", "No Listings exists for this filter!");
        res.redirect("/listings");
        return;
    }
    res.locals.success = `Listings Filtered by ${q}`;
    res.render("listings/index.ejs", { allListings: filteredListings });
}