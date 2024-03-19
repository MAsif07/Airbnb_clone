module.exports.isLoggedIn= (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.url= req.originalUrl;
        req.flash("error", "You must be Logged In the Listing!");
        return res.redirect("/login");
    }
    next();
}