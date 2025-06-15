const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  type: String,
  fanFlow: String,
  fanPressure: String,
  aspFlow: String,
  aspPressure: String,
  heatingNeed: String,
  coolingNeed: String,
  reheaterNeed: String,
});

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  projectName: {
    type: String,
    required: true,
  },
  location: String,
  altitude: Number,
  winterDryTemp: Number,
  summerDryTemp: Number,
  summerWetTemp: Number,
  units: [unitSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', projectSchema);
