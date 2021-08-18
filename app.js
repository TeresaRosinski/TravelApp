const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Destination = require("./models/destination");
const ejsMate = require('ejs-mate');

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

app.get("/destinations", async (req, res) => {
  const destinations = await Destination.find({});
  res.render("index", { destinations });
});

app.get("/destinations/new", (req, res) => {
  res.render("new");
});

app.post("/destinations", async (req, res) => {
  const destination = new Destination(req.body.destination);
  await destination.save();
  res.redirect(`/destinations/${destination._id}`);
});

app.get("/destinations/:id", async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  res.render("show", { destination });
});

app.get("/destinations/:id/edit", async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  res.render("edit", { destination });
});

app.put("/destinations/:id", async (req, res) => {
  const { id } = req.params;
  const destination = await Destination.findByIdAndUpdate(id, {
    ...req.body.destination
  });
  console.log(destination);
  res.redirect(`/destinations/${destination._id}`);
});

app.delete('/destinations/:id', async(req, res) => {
  const { id } = req.params;
  await Destination.findByIdAndDelete(id);
  res.redirect('/destinations');
})

app.listen(3000, () => {
  console.log("serving on port 3000");
});
