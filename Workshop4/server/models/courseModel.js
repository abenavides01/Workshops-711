const mongoose = require('mongoose');


const courseSchema = new mongoose.Schema({
  name: { type: String },
  credits: { type: Number },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'teachers', required: true }
});

module.exports = mongoose.model('Course', courseSchema);