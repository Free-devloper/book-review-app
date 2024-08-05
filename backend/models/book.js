const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  review: { type: String, required: true },
  rating: { type: Number, required: true },
  images: { type: [String], default: [] } // Array of image filenames
});

module.exports = mongoose.model('Book', BookSchema);
