 const mongoose = require('mongoose');
 
const urlSchema = new mongoose.Schema({
    original_url: {
      type: String,
      required: true,
    },
    short_url: {
      type: Number,
      required: true,
      unique: true, 
    },
    createdAt: {
      type: Date,
      default: Date.now, 
      index: { expires: '15d' },
    },
  });
  
  const Url = mongoose.model('Url', urlSchema);

  module.exports = Url;
