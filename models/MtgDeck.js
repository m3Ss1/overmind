const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MtgDeck = new Schema({
    id: String,
    name: String,
    cards: [{
      name: String,
      quantity: Number
    }]
  })
;

module.exports = mongoose.model('MtgDeck', MtgDeck);
