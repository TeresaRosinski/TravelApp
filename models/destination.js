const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
  title: String, 
  location: String,
  images: String, 
  timing: [ 
    {
      body: String 
    } 
  ], 
  budget: String, 
  lodging: [ String ], 
  transportation: String, 
  safety: String, 
  experiences: [
    {
      name: String,
      location: String, 
      price: Number, 
      id: String,
    }
  ] , 
  notes: [
    {
      body: String, 
    }
  ]
});

module.exports = mongoose.model('Destination', DestinationSchema);