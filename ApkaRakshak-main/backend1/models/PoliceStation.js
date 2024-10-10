// models/PoliceStation.js
const mongoose = require('mongoose');

const policeStationSchema = new mongoose.Schema({
    name: String,
    lat: Number,
    lon: Number,
});

module.exports = mongoose.model('PoliceStation', policeStationSchema);
