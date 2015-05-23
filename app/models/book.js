var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookSchema = new Schema({
  title: {type: String, default: ''},
  pages: {type: Number, default: 0},
  haveRead: {type: Boolean, default: false}
});

mongoose.model('Book', BookSchema);
