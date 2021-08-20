const mongoose = require("mongoose");
const destinations = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Destination = require("../models/destination");

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Destination.deleteMany({});
  for (let i = 0; i < 13; i++) {
    const random50 = Math.floor(Math.random() * 50);
    let image = ['https://source.unsplash.com/iEJVyyevw-U', 'https://source.unsplash.com/v2lS1ECeCOM', 'https://source.unsplash.com/collection/9728339/1600x900'];
    let price = Math.floor(Math.random() * 100);
    const destination = new Destination({
      name: `${sample(descriptors)} ${sample(places)}`,
      location: `${destinations[random50].city}, ${destinations[random50].state}`,
      image,
      price, 
      description: "lorem ipsum loremipsum lor asdf no asd lou"
    });
    console.log(destination);
    await destination.save();
  }
};


seedDB().then(()=> {
  mongoose.connection.close();
})