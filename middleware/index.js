//ALL THE MIDDLEWARE GOES HERE
var Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function (err, foundCampground)
        {
            if (err){
                console.log(err);
                req.flash("error", "No campground found.");
                res.redirect("back");
            }else if(foundCampground.author.id.equals(req.user._id))
            {
                next();
            }else{
                req.flash("error", "You have no permission.");
                res.redirect("back");
            }
        });
    }
    else{
        req.flash("error", "You need to be logged in.");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comments_id, function (err, foundComment)
        {
            if (err){
                console.log(err);
                req.flash("error", "No comment found.");
                res.redirect("back");
            }else if(foundComment.author.id.equals(req.user._id))
            {
                next();
            }else{
                req.flash("error", "You have no permission.");
                res.redirect("back");
            }
        });
    }
    else{
        req.flash("error", "You need to be logged in.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    else{
        req.flash("error", "You need to be Logged in to do that.");
        res.redirect("/login");
    }
};


module.exports = middlewareObj;