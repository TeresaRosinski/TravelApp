const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
  title: String, 
  city: String,
  country: String,  
  details: [String], 
  images: [String],  
  experiences: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Experience',
    }
  ]
});

module.exports = mongoose.model('Destination', DestinationSchema);