var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Book = mongoose.model('Book');

/* GET users listing. */
router.get('/', function(req, res, next) {
  Book.find({}, function(err, books) {
    if (err) console.log(err);
    res.render('books/index', {books: books})
  });
});

router.get('/:id', function(req, res, next) {
  Book.findOne({_id: req.params.id}, function(err, book) {
    if (err) return console.log(err);
    res.render('books/show', {book: book});
  });
});

module.exports = router;
