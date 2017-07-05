const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
  // schema goes here
  name: {
    type: String,
    default: "Earth",
    require: true
  },
  orbit: {
    type: Number,
    default: 365
  },
  size: {
    type: String,
    default: "12742 km"
  }
});

const Planet = mongoose.model('Planet', planetSchema);

module.exports = Planet;
