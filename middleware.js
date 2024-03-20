const passport = require("passport");
module.exports.isLoggedIn= (req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.flash("error", "You must be Logged In the Listing!");
        return res.redirect("/login");
    }
    next();
}