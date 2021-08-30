const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Destination = require("./models/destination");
const Experience = require("./models/experience");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Joi = require("joi");
const { destinationSchema } = require("./schemas");

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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//for css
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//homemade joi middleware
//joi schema validation - not mongoose schema but joi package server-side validation!!!
const validateDestination = (req, res, next) => {
  console.log("req.body", req.body);
  const { error } = destinationSchema.validate(req.body);
  console.log("error", error.details);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
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

app.get(
  "/destinations",
  catchAsync(async (req, res) => {
    const destinations = await Destination.find({});
    res.render("destinations/index", { destinations });
  })
);

app.get(
  "/experiences",
  catchAsync(async (req, res) => {
    const experiences = await Experience.find({});
    const destinations = await Destination.find({});
    res.render("experiences/index", { experiences, destinations });
  })
);

app.get("/destinations/new", (req, res) => {
  res.render("destinations/new");
});

app.get("/experiences/new", (req, res) => {
  res.render("experiences/new");
});

app.post(
  "/destinations",
  catchAsync(async (req, res, next) => {
    //if(!req.body.destination) throw new ExpressError('Invalid Destination Data', 400);
    console.log("req new", req);
    const destination = new Destination(req.body.destination);
    await destination.save();
    res.redirect(`/destinations/${destination._id}`);
  })
);

app.post(
  "/experiences",
  catchAsync(async (req, res, next) => {
    console.log("req new", req);
    const experience = new Experience(req.body.experience);
    await experience.save();
    res.redirect(`/experiences/${experience._id}`);
  })
);

app.get(
  "/destinations/:id",
  catchAsync(async (req, res) => {
    const destination = await Destination.findById(req.params.id);
    const experience = await Destination.findById(req.body.experience_id);
    res.render("destinations/show", { destination, experience });
  })
);

//Get specific experience info with all for to choose destination - so all destinations need to be passed in
app.get(
  "/experiences/:id",
  catchAsync(async (req, res) => {
    const experience = await Experience.findById(req.params.id);
    const destinations = await Destination.find({});
    res.render("experiences/show", { experience, destinations });
  })
);

app.get(
  "/destinations/:id/edit",
  catchAsync(async (req, res) => {
    const destination = await Destination.findById(req.params.id);
    res.render("destinations/edit", { destination });
  })
);

app.get(
  "/experiences/:id/edit",
  catchAsync(async (req, res) => {
    const experience = await Experience.findById(req.params.id);
    res.render("experiences/edit", { experience });
  })
);

app.put(
  "/destinations/:id",
  catchAsync(async (req, res) => {
    console.log("req show page dest", req);
    console.log("params edit dest show page", req.params);
    const { id } = req.params;
    console.log("req.body.destination", req.body.destination);
    const destination = await Destination.findByIdAndUpdate(id, {
      ...req.body.destination,
    });
    console.log(destination);
    res.redirect(`/destinations/${destination._id}`);
  })
);

//PUT Route for Notes section of destination/:id page
app.post(
  "/destinations/:id/notes",
  catchAsync(async (req, res) => {
    console.log("req body.dstination", req.body.destination.notes);
    const { id } = req.params;
    ///why undefined note????
    const { note } = req.body.destination.notes;
    console.log("note", note);
    const destination = await Destination.findById(id);
    //successsfully pushes body into array
    destination.notes.push({ body: req.body.destination.notes });
    console.log(destination.notes);
    await destination.save();

    res.redirect(`/destinations/${destination._id}`);
  })
);

app.put(
  "/experiences/:id",
  catchAsync(async (req, res) => {
    console.log("req edie", req);
    console.log("params edit", req.params);
    const { id } = req.params;
    console.log("req.body.experience", req.body.experience);
    const experience = await Experience.findByIdAndUpdate(id, {
      ...req.body.experience,
    });
    console.log(experience);
    res.redirect(`/experiences/${experience._id}`);
  })
);

//delete indv note
/// form route/action: "/destinations/<%= destination._id %>/note/<%= note._id %>?_method=DELETE"
app.delete(
  "/destinations/:id/note/:noteID",
  catchAsync(async (req, res) => {
    const { id, noteID } = req.params;
    console.log("params", req.params);
    const destination = await Destination.findById(id);
    console.log("destination", destination);
    const newArrayNotes = destination.notes.filter(note => note._id != noteID);
    console.log(newArrayNotes);
    destination.notes = newArrayNotes;
    destination.save();
    res.redirect(`/destinations/${destination._id}`);
  })
);

//form route/action: "/destinations/<%=destination._id%>?_method=DELETE" method="POST"
app.delete(
  "/destinations/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Destination.findByIdAndDelete(id);
    res.redirect("/destinations");
  })
);

app.delete(
  "/experiences/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Experience.findByIdAndDelete(id);
    res.redirect("/experiences");
  })
);

app.post(
  "/destinations/:id/experiences/:expId",
  catchAsync(async (req, res) => {
    console.log("post both req:", req.params);
    const { id, expId } = req.params;

    const destination = await Destination.findById(id);
    console.log("destination", destination);
    const experience = await Experience.findById(expId);

    console.log("experience", experience.name);
    destination.experiences.push({ name: experience.name, id: expId });
    await destination.save();
    console.log("destination2", destination);
    res.redirect(`/destinations/${destination._id}`);
  })
);

//for urls requested that don't exist - ORDER IS IMPORTANT
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not FOund", 404));
});
// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "oh no!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("serving on port 3000");
});
