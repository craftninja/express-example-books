# README

How I made this:

1. $ express book
1. $ cd book && npm install
1. $ git init
1. create `README.md` outlining steps (and continue updating)
1. create `.gitignore`, add node_modules directory
  * `node_modules/**`
1. commit
1. change users routes to book routes
  * in `app.js`, change:
    * `var users = require('./routes/users');` to `var bookRoutes = require('./routes/books');`
    * `app.use('/users', users);` to `app.use('/books', bookRoutes);`
  * rename `routes/users.js` to `routes/books.js`
1. commit
1. add mongoose, User can see books listed on the index page
  * to `package.json` add to dependencies `"mongoose": "*",`
  * $ npm install
  * in `app.js` add above `view engine setup`:

    ```
    var mongoConnection = function () {
      var options = {server: {socketOptions: {keepAlive: 1}}};
      mongoose.connect('mongodb://localhost/book', options);
    };
    mongoConnection();

    mongoose.connection.on('error', console.log);
    mongoose.connection.on('disconnected', mongoConnection);
    ```

  * in same file under the top requires, add `var mongoose = require('mongoose');`
  * in the same file, above routes add `var book = require('./app/models/book');`
  * add file `/app/models/book.js` with the content:

    ```
    var mongoose = require('mongoose');

    var Schema = mongoose.Schema;

    var BookSchema = new Schema({
      title: {type: String, default: ''},
      pages: {type: Number, default: 0},
      haveRead: {type: Boolean, default: false}
    });

    mongoose.model('Book', BookSchema);
    ```

  * in `routes/books.js`:
    * add `var mongoose = require('mongoose');` under other require
    * add access to the model under router declaration: `var Book = mongoose.model('Book');`
    * find all books in the database and pass them into the view

      ```
      router.get('/', function(req, res, next) {
        Book.find({}, function(err, books) {
          if (err) console.log(err);
          res.render('books/index', {books: books})
        });
      });
      ```

  * add `view/books/index.jade` with the following content:

    ```
    h1  My Books

    ul
      each book in books
        if book.haveRead
          li= book.title + " (" + book.pages + "pages) - read"
        else
          li= book.title + " (" + book.pages + " pages) - unread"

    ```

  * create the mongo database and add one book:

    ```
    $mongo
    MongoDB shell version: 3.0.3
    connecting to: test
    > use book
    switched to db book
    > db.books
    book.books
    > db.books.insert({title: "Stardust", pages: 304, haveRead: true})
    WriteResult({ "nInserted" : 1 })
    ```
