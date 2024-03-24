const express = require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner}= require("../middleware.js");
const listingController= require("../controllers/listing.js")

const multer= require("multer");
const {storage}=require("../cloudConfig.js");
const upload= multer({storage});

// function to validate middleware
const validateSchema=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if (error){
      let errmsg= error.details.map((el)=> el.message).join(",");
      throw new ExpressError(404,errmsg);
    }else{
      next();
    }
  };

//Index Route
router.get("/", wrapAsync(listingController.renderIndex));
  
  // New Route
  router.get("/new", isLoggedIn,listingController.renderNewform);
  
  // //Show Route
  router.get("/:id", wrapAsync(listingController.showListing));
  
  //Create Route
  router.post("/",isLoggedIn,upload.single("listing[image]"), wrapAsync(listingController.createListing));
 
  
  //Edit Route
  router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editListing));
  
  // //Update Route
  router.put("/:id",validateSchema, isLoggedIn,isOwner, wrapAsync(listingController.updateLising));
  
  
  // //Delete Route
  router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

  module.exports=router;