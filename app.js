if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session= require("express-session");
const flash= require("connect-flash");

const passport = require("passport");
LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlist";
// const dbUrl= process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));
const sessionOption={
  secret: "mysuperSecrectCode",
  resave: false,
  saveUninitialized:true,
}
app.use(session(sessionOption));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.successMsg= req.flash("success");
  res.locals.error= req.flash("error");
  res.locals.currUser= req.user;
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter)






// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });


app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
  let {statusCode=505, message="Something wrong"}=err;
  res.status(statusCode).render("listings/err.ejs",{message});
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});