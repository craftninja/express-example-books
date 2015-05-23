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

module.exports = router;
