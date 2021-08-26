const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const experienceSchema = new Schema ({
  name: String, 
  description: String, 
  type: String,
  cost: Number, 
  details: [String],
  images: [String]
})

module.exports = mongoose.model("Experience", experienceSchema);