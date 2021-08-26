const mongoose = require("mongoose");
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
    const destination = new Destination({
      title: 'Chicago',
      city: 'Chicago',
      images:'https://source.unsplash.com/iEJVyyevw-U',
    
    });
    console.log(destination);
    await destination.save();
  };


seedDB().then(()=> {
  mongoose.connection.close();
})