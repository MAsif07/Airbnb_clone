const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registredUser = await User.register(newUser, password);
        req.login(registredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to The Wanderlust");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }
};


module.exports.renderLoginFom = (req, res) => {
    res.render("users/login.ejs");
};


module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to Wanderlst. You are Login!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("succes", "You logOut!")
        res.redirect("/login");
    })
};