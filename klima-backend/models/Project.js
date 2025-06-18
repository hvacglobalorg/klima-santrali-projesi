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
    default: 'Yeni Proje',  // Boş gelirse otomatik atanacak
  },
  location: {
    type: String,
    default: 'Belirtilmedi',
  },
  altitude: {
    type: Number,
    default: null,
  },
  winterDryTemp: {
    type: Number,
    default: null,
  },
  summerDryTemp: {
    type: Number,
    default: null,
  },
  summerWetTemp: {
    type: Number,
    default: null,
  },
  units: {
    type: [unitSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', projectSchema);
