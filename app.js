var express                = require("express"),
    bodyParser             = require("body-parser"),
    mongoose               = require("mongoose"),
    flash                  = require("connect-flash"),
    methodOverride         = require("method-override"),
    User                   = require("./models/user"),
    passport               = require("passport"),
    LocalStrategy          = require("passport-local"),
    passportLocalMongoose  = require("passport-local-mongoose"),
    Campground             = require("./models/campground"),
    Comment                = require("./models/comment"),
    app                    = express();

//Requiring routes
var commentRoutes          = require("./routes/comments"),
    campgroundRoutes       = require("./routes/campgrounds"),
    indexRoutes             = require("./routes/index");

//mongoose.connect("mongodb://localhost/yelp_camp");
//mongodb://admin:password@ds251518.mlab.com:51518/yelpcamp
mongoose.connect(process.env.DATABASEURL);

app.set("view engine", "ejs"); //cut short .ejs declarations
app.use(bodyParser.urlencoded({extended: true})); //extend parsing
app.use(express.static(__dirname + "/public")); //deeper folder access
app.use(methodOverride("_method")); //for put/delete requests
app.use(flash()); //before passport

//PASSPORT CONFIGURATION
app.use(require("express-session")(
    {
        secret: "The best camps ever? Honestly!",
        resave: false,
        saveUninitialized: false
    }
));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Add currentUser to responses
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

// Initialize routes
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.get("/*", function (req, res) {
    res.send("PAGE NOT FOUND");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp server has started!");
});