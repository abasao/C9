var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");


//==========================================
//       CAMPGROUND ROUTES
//==========================================

// INDEX CAMPGROUND
router.get("/", function (req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds){
        if (err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// CREATE CAMPGROUND
router.post("/", middleware.isLoggedIn, function(req, res){
    var campground = req.body.campground;
    campground.author = 
    {
        id: req.user._id,
        username: req.user.username
    };
    Campground.create(campground, function (err,NewCampground){
        if (err){
            console.log(err);
        } else{
            req.flash("success", "Campground Created.");
            res.redirect("/campgrounds");
        }
    });
});

// NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn, function (req, res) {
   res.render("campgrounds/new");
});

// SHOW CAMPGROUND
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground){
        if (err || foundCampground==null){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", 
            {campground: foundCampground, id: req.params.id}); 
    });
});

// UPDATE CAMPGROUND
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, { new: true },
    function(err, foundCampground){
      if(err){
          console.log(err);
          res.redirect("back");
      } 
      else{
          req.flash("success", "Updated Campground.");
          res.redirect("/campgrounds/"+req.params.id);
      }
    });
});

//DELETE CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    var id = req.params.id;
    Campground.findByIdAndRemove(id, function (err, foundCampground) {
        if (err){console.log(err); res.redirect("back");}
        else{
            req.flash("success", "Campground Deleted");
            res.redirect("/campgrounds/");
        }
    });
});

module.exports = router;