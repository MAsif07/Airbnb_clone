const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn,isReviewAuthor } = require("../middleware.js");

const reviewController= require("../controllers/review.js");

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if (error){
      let errmsg= error.details.map((el)=> el.message).join(",");
      console.log(errmsg);
      throw new ExpressError(404,errmsg);
      
    }
    else{
      next();
    }
  };

// Post Review Route
router.post("/",isLoggedIn,wrapAsync(reviewController.createReview));
  
  // Delete Review Route
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

  module.exports=router;