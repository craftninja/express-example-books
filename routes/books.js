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

router.get('/new', function(req, res, next) {
  res.render('books/new')
});

router.post('/', function(req, res, next) {
  book = new Book({
    title: req.body['book[title]'],
    pages: req.body['book[pages]'],
    haveRead: req.body['book[haveRead]']
  })
  book.save(function (err, book) {
    if (err) return console.error(err);
    res.redirect('books/' + book.id);
  });
});

router.get('/:id', function(req, res, next) {
  Book.findOne({_id: req.params.id}, function(err, book) {
    if (err) return console.log(err);
    res.render('books/show', {book: book});
  });
});

router.get('/:id/edit', function(req, res, next) {
  Book.findOne({_id: req.params.id}, function(err, book) {
    if (err) return console.log(err);
    res.render('books/edit', {book: book});
  });
});

router.post('/:id', function(req, res, next) {
  Book.findOne({_id: req.params.id}, function(err, book) {
    if (err) return console.log(err);
    book.title = req.body['book[title]'];
    book.pages = req.body['book[pages]'];
    book.haveRead = req.body['book[haveRead]'];
    book.save(function (err, book) {
      if (err) return console.error(err);
      res.redirect('/books/' + book.id);
    })
  });
});

module.exports = router;
