const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {isLoggedIn} = require('../middleware')
const {isOwner} = require('../middleware')
const {validateListing} = require('../middleware')
const {index, newListingsForm, editListing, updateListing, deleteListing, detailsOfTheListings, createListing, filterListings} = require('../controllers/listings')

const {storage} =require('../cloudConfig')
const multer  = require('multer')
const upload = multer({ storage })



// index route   ---> create Listings 
router.route('/')
.get(wrapAsync(index)) // coment out validateListing
.post(isLoggedIn, 
  upload.single(`listing[image]`),
   wrapAsync(createListing))


//New route
router.get("/new",isLoggedIn,newListingsForm)


// edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(editListing))

// show Listings ---> updateListing  ---> deleteListing
router.route('/:id')
.get( wrapAsync(detailsOfTheListings))
.put(isLoggedIn,isOwner, 
  upload.single('listing[image]'),
  validateListing, wrapAsync(updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(deleteListing))


router.get("/filter/:q", wrapAsync(filterListings));


 










module.exports = router;