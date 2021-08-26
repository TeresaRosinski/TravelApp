const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Destination = require("./models/destination");
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const { destinationSchema } = require('./schemas');
mongoose.connect("mongodb://localhost:27017/travel-app", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection: "));
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//homemade joi middleware
//joi schema validation - not mongoose schema but joi package server-side validation!!!
const validateDestination = (req, res, next) => {
  const { error } = destinationSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
  console.log(result);
};

/*
app.use((req, res, next) => {
  req.requestTime = Date.now();
  console.log(req.method, req.path, req.requestTime);
  next();
  
})
*/
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/destinations", catchAsync(async (req, res) => {
  const destinations = await Destination.find({});
  res.render("destinations/index", { destinations });
}));

app.get("/destinations/new", (req, res) => {
  res.render("destinations/new");
});

app.post("/destinations", validateDestination, catchAsync(async( req, res, next  ) => {
  //if(!req.body.destination) throw new ExpressError('Invalid Destination Data', 400);
  
  const destination = new Destination(req.body.destination);
  await destination.save();
  res.redirect(`/destinations/${destination._id}`);
}));

app.get("/destinations/:id", catchAsync(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  res.render("destinations/show", { destination });
}));

app.get("/destinations/:id/edit", catchAsync(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  res.render("destinations/edit", { destination });
}));

app.put("/destinations/:id", validateDestination, catchAsync(async (req, res) => {
  const { id } = req.params;
  const destination = await Destination.findByIdAndUpdate(id, {
    ...req.body.destination
  });
  console.log(destination);
  res.redirect(`/destinations/${destination._id}`);
}));

app.delete('/destinations/:id', catchAsync(async(req, res) => {
  const { id } = req.params;
  await Destination.findByIdAndDelete(id);
  res.redirect('/destinations');
}));


//for urls requested that don't exist - ORDER IS IMPORTANT 
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not FOund', 404))
})
// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  if(!err.message) err.message="oh no!"
  res.status(statusCode).render('error', { err })

})

app.listen(3000, () => {
  console.log("serving on port 3000");
});
