const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  type: String,
  fanFlow: String,
  fanPressure: String,
  aspFlow: String,
  aspPressure: String,
  heatingNeed: String,
  heatingType: String,
  heatingCapacity: String,
  coolingNeed: String,
  coolingType: String,
  coolingCapacity: String,
  humidNeed: String,
  humidType: String,
  humidCapacity: String,
  advancedEnabled: Boolean,
  winterTemp: Number,
  summerTemp: Number,
  customWidth: String,
  customLength: String,
  customHeight: String,
  isHygienic: Boolean,
  silencer: String,
  silencerFan: Boolean,
  silencerExhaust: Boolean,
  recoveryType: String,
  mixingType: String,
}, { _id: false });

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  projectName: {
    type: String,
    required: true,
    default: 'Yeni Proje',
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
  uploadedFiles: {
    type: [String],
    default: [],
  },
}, { timestamps: true }); // createdAt ve updatedAt otomatik

module.exports = mongoose.model('Project', projectSchema);
