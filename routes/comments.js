var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"), 
    Comment     = require("../models/comment"),
    middleware = require("../middleware");

//==========================================
//       COMMENT ROUTES
//==========================================

// COMMENTS SHOW
router.get("/", function (req, res) {
    res.redirect("/campgrounds/"+req.params.id);
});

// COMMENTS NEW
router.get("/new", middleware.isLoggedIn, function (req, res) {
   res.render("comments/new",{id: req.params.id});
});

// COMMENTS CREATE
router.post("/", middleware.isLoggedIn, function (req, res) {
    var text = req.body.text;
    Campground.findById(req.params.id, function (err, foundCampground){
        if (err){
            console.log(err);
        }else{
            Comment.create({text: text}, function(err,comment){
                if(err){console.log(err)}
                else{
                    //add username and id to comments
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //save comment
                    foundCampground.comments.push(comment._id);
                    foundCampground.save();
                    req.flash("success", "Added Comment.");
                    res.redirect("/campgrounds/"+req.params.id+"/comments");
                }
            });
        }
    });
});

//EDIT Comment
router.get("/:comments_id/edit", middleware.checkCommentOwnership, function(req, res){
    var comments_id = req.params.comments_id;
    Comment.findById(comments_id, function(err, foundComment){
        if(err){console.log(err);}
        res.render("comments/edit",{
            comment: foundComment,
            id: req.params.id, 
            comments_id: comments_id});
    });
});

// UPDATE Comment
router.put("/:comments_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comments_id, {text: req.body.text}, { new: true },
    function(err, foundComment){
      if(err){
          console.log(err);
          res.redirect("back");
      } 
      else{
        req.flash("success", "Updated Comment.");
          res.redirect("/campgrounds/"+req.params.id);
      }
    });
});

//DELETE COMMENT
router.delete("/:comments_id", middleware.checkCommentOwnership, function(req, res){
    var id = req.params.comments_id;
    Comment.findByIdAndRemove(id, function (err, foundComment) {
        if (err){console.log(err); res.redirect("back");}
        else{
            req.flash("success", "Comment Deleted.");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;

