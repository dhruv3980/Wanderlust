const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {validatReview, isLoggedIn, isReviewOwner} = require('../middleware')
const {createReview, destroyReview} = require('../controllers/review')



router.post("/", isLoggedIn, validatReview, wrapAsync(createReview))

// Review  Delete Review route 
router.delete("/:reviewid",isLoggedIn,isReviewOwner, wrapAsync(destroyReview))



module.exports = router;