const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Book = require('../models/book');
const auth = require('../middleware/auth');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching books' });
  }
});

// Add a new book with images (protected route)
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const images = req.files.map(file => file.filename);
    const newBook = new Book({
      ...req.body,
      images
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      res.status(400).json({ errors: messages });
    } else {
      res.status(500).json({ error: 'An error occurred while adding the book' });
    }
  }
});

// Delete a book (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the book' });
  }
});

module.exports = router;
