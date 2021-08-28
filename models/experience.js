const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const experienceSchema = new Schema ({
  name: String, 
  description: String, 
  image: String,
})

module.exports = mongoose.model("Experience", experienceSchema);