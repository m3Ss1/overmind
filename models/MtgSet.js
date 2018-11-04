const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MtgSet = new Schema({

  object: String,
  code: String,
  mtgo_code: String,
  name: String,
  uri: String,
  scryfall_uri: String,
  search_uri: String,
  released_at: String,
  set_type: String,
  card_count: Number,
  digital: Boolean,
  foil_only: Boolean,
  block_code: String,
  block: String,
  icon_svg_uri: String

});

module.exports = mongoose.model('MtgSet', MtgSet);
