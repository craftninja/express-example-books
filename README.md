# README

### Get this puppy up and running

1. Fork, clone, npm install
1. start server
  * DEBUG=book:* npm start
  * server must be stopped and started with each codebase change

### How I made this:

1. $ express book
1. $ cd book && npm install
1. start server
  * DEBUG=book:* npm start
  * server must be stopped and started with each codebase change
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
    $ mongo
    MongoDB shell version: 3.0.3
    connecting to: test
    > use book
    switched to db book
    > db.books
    book.books
    > db.books.insert({title: "Stardust", pages: 304, haveRead: true})
    WriteResult({ "nInserted" : 1 })
    ```

1. commit
1. user can see a book's show page
  * add link to index

    ```
    if book.haveRead
      li
        a(href="books/#{book.id}")= book.title
        =" (" + book.pages + "pages) - read"
    else
      li
        a(href="books/#{book.id}")= book.title
        =" (" + book.pages + " pages) - unread"
    ```

  * add route to `routes/books.js`

    ```
    router.get('/:id', function(req, res, next) {
      Book.findOne({_id: req.params.id}, function(err, book) {
        if (err) return console.log(err);
        res.render('books/show', {book: book});
      });
    });
    ```

  * add show page to `views/books/show.jade`

    ```
    h1= book.title

    if book.haveRead
      p This book is #{book.pages} pages long, and you have read this book.
    else
      p This book is #{book.pages} pages long, and you have not read this book.
    ```

1. commit
1. user can add new books
  * add "new" link to books index

    ```
    a(href="books/new") Add a new book
    ```

  * add route for new books

    ```
    router.get('/new', function(req, res, next) {
      res.render('books/new')
    });
    ```

  * add new page `views/books/new.jade`

    ```
    h1  New Book
    form(action='/books' method='post')
      p
        label Title
        input(type='text' name='book[title]')
      p
        label Number of Pages
        input(type='number' name='book[pages]')
      p
        label Have you read this book?
          input(type='checkbox' name='book[haveRead]')
      p
        input(type='submit' name='commit' value='Add Book')
    ```

  * add create route

    ```
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
    ```

  * alter paths in index (not sure why... just started directing to `books/books/...`)

    ```
    h1  My Books

    a(href="/books/new") Add a new book

    ul
      each book in books
        if book.haveRead
          li
            a(href="/books/#{book.id}")= book.title
            =" (" + book.pages + "pages) - read"
        else
          li
            a(href="/books/#{book.id}")= book.title
            =" (" + book.pages + " pages) - unread"
    ```

1. commit
1. user can edit / update books
  * add link to edit from book show page
    * `a(href="/books/#{book.id}/edit") Edit this book`
  * add edit route for book

    ```
    router.get('/:id/edit', function(req, res, next) {
      Book.findOne({_id: req.params.id}, function(err, book) {
        if (err) return console.log(err);
        res.render('books/edit', {book: book});
      });
    });
    ```

  * add edit view `view/books/edit.jade`

    ```
    h1 Edit #{book.title}
    form(action='/books/' + book.id method='post')
      p
        label Title
        input(type='text' name='book[title]' value='#{book.title}')
      p
        label Number of Pages
        input(type='number' name='book[pages]' value='#{book.pages}')
      if book.haveRead
        p
          label Have you read this book?
            input(type='checkbox' name='book[haveRead]' checked='#{book.haveRead}')
      else
        p
          label Have you read this book?
            input(type='checkbox' name='book[haveRead]')
      p
        input(type='submit' name='commit' value='Update Book')

    ```

  * add update route for book

    ```
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
    ```

1. commit
1. user can delete books
  * add delete link to show page
    * `a(href="/books/#{book.id}/delete") Delete this book`
  * add delete route for book

    ```
    router.get('/:id/delete', function(req, res, next) {
      Book.findOne({_id: req.params.id}, function(err, book) {
        if (err) return console.log(err);
        book.remove();
        res.redirect('/books/');
      });
    });
    ```

1. commit
1. style this project with bootstrap
  * go to [http://getbootstrap.com/](http://getbootstrap.com/) and download the bootstrap zip
  * unzip file, and rename top directory just `bootstrap`
  * move entire `bootstrap` directory inside this app's `public` directory
  * change `layout.jade` head content to just this:

    ```
    title= title
    link(rel='stylesheet', href='/bootstrap/css/bootstrap.min.css')
    link(rel='stylesheet', href='/bootstrap/css/bootstrap-responsive.min.css')
    link(rel='stylesheet', href='/stylesheets/style.css')
    script(src='http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js')
    script(src='/bootstrap/js/bootstrap.min.js')
    ```

  * Add the following at the top each of your nested views and tab in all content once (so everything is nested under `block content`)

    ```
    extends ../layout

    block content
      <!-- rest of view -->
    ```

    * note the `../layout` which references `layout.jade` in the `views` directory. If you want a specific layout for the directory of views you might be in (for example `books`), create a new layout in that same directory and just use `layout` here.
  * style away!
