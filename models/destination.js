const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
  title: String, 
  city: String,
  images: String, 
  experiences: [
    {
      name: String,
      id: String
    }
  ] 
});

module.exports = mongoose.model('Destination', DestinationSchema);