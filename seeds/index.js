const mongoose = require("mongoose");
const Destination = require("../models/destination");
const Experience = require("../models/experience");

mongoose.connect("mongodb://localhost:27017/travel-app", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database Connected");
});

const seedDbDest = async () => {
  await Destination.deleteMany({});
  const destination = new Destination({
    title: "Chicago",
    city: "Chicago",
    images: "https://source.unsplash.com/iEJVyyevw-U",
    experiences:['612941c0188b942bb0382b44'],
  });
  console.log(destination);
  await destination.save();
};

const seedDbExp = async () => {
  const experience = new Experience({
    name: "Boooty hall",
    description: "lame",
    image: "https://source.unsplash.com/iEJVyyevw-U",
  });
  console.log(experience);
  await experience.save();
};

seedDbDest().then(() => {
  mongoose.connection.close();
});;


