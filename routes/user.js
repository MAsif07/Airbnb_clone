const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");


router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signup", wrapAsync(async(req,res)=>{
try{
    let {username, email, password}= req.body;
const newUser= new User({username, email});
const registredUser= await User.register(newUser, password);
console.log(registredUser);
req.flash("success", "Welcome to The Wanderlust");
res.redirect("/listings");
} catch (e){
    req.flash("error", e.message);
    res.redirect("/signup")
}
})
);

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
});
router.post("/login",passport.authenticate("local",{failureRedirect:"/login", failureFlash: true}), async(req,res)=>{
req.flash("success", "Welcome to Wanderlst. You are Login!")
res.redirect("/listings");
})



module.exports=router;