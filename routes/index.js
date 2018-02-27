var express    = require("express"),
    passport    = require("passport"),
    router     = express.Router(),
    Campground = require("../models/campground"), 
    User       = require("../models/user");

// ROOT ROUTE
router.get("/", function (req, res) {
    res.render("landing");
});

//==========================================
//      USER AUTH ROUTES
//==========================================

// SHOW NEW USER FORM
router.get("/register", function (req, res) {
    res.render("register");
});

// HANDLE USER SIGNUP LOGIC
router.post("/register", function (req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           return res.redirect("/register")
       }
       else{
           passport.authenticate("local")(req, res, function(){
               req.flash("success", "Welcome "+user.username);
              res.redirect("/campgrounds"); 
           });
       }
    });
});

// SHOW USER LOGIN 
router.get("/login", function(req, res) {
    res.render("login");
});

// HANDLE USER LOGIN LOGIC
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), 
    function(req, res) {
});

// HANDLE USER LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out!");
    res.redirect("/campgrounds");
});


module.exports = router;