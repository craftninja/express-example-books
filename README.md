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
