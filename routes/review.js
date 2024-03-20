const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

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
router.post("/", wrapAsync(async(req,res)=>{
    let{id}=req.params;
    let listing= await Listing.findById(id);
    let newReview=new Review(req.body.review);
  
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New review Added!");
    res.redirect(`/listings/${listing._id}`);
  }));
  
  // Delete Review Route
  router.delete("/:reviewId", wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  }));

  module.exports=router;