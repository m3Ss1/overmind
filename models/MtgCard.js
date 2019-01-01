const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MtgCard = new Schema({
    object: String,
    id: String,
    oracle_id: String,
    multiverse_ids: [Number],
    mtgo_id: Number,
    mtgo_foil_id: Number,
    arena_id: Number,
    name: String,
    lang: String,
    released_at: String,
    uri: String,
    scryfall_uri: String,
    layout: String,
    highres_image: Boolean,
    image_uris: {
      small: String,
      normal: String,
      large: String,
      png: String,
      art_crop: String,
      border_crop: String
    },
    mana_cost: String,
    cmc: Number,
    type_line: String,
    oracle_text: String,
    colors: [String],
    color_identity: [String],
    legalities: {
      standard: String,
      future: String,
      frontier: String,
      modern: String,
      legacy: String,
      pauper: String,
      vintage: String,
      penny: String,
      commander: String,
      duel: String,
      brawl: String
    },
    reserved: Boolean,
    foil: Boolean,
    nonfoil: Boolean,
    oversized: Boolean,
    reprint: Boolean,
    set: String,
    set_name: String,
    set_uri: String,
    set_search_uri: String,
    scryfall_set_uri: String,
    rulings_uri: String,
    prints_search_uri: String,
    collector_number: String,
    digital: Boolean,
    rarity: String,
    flavor_text: String,
    illustration_id: String,
    artist: String,
    frame: String,
    full_art: Boolean,
    border_color: String,
    timeshifted: Boolean,
    colorshifted: Boolean,
    futureshifted: Boolean,
    story_spotlight: Boolean,
    edhrec_rank: Number,
    usd: String,
    tix: String,
    eur: String,
    related_uris: {
      gatherer: String,
      tcgplayer_decks: String,
      edhrec: String,
      mtgtop8: String
    },
    purchase_uris: {
      amazon: String,
      ebay: String,
      tcgplayer: String,
      magiccardmarket: String,
      cardhoarder: String,
      card_kingdom: String,
      mtgo_traders: String,
      coolstuffinc: String
    },
    card_faces: [{
      object: String,
      name: String,
      mana_cost: String,
      type_line: String,
      illustration_id: String,
      image_uris: {
        small: String,
        normal: String,
        large: String,
        png: String,
        art_crop: String,
        border_crop: String
      }
    }],

    /* personal fields */
    display_number: Number, /* storing cards in order to avoid complex parsing of collection_number (e.g. ZEN/230a) */
    collection_count: {type: Number, default: 0},
    in_deck_count: {type: Number, default: 0},
    deck_note: String,
    purchase_price: Number,
    gain_loss: Number,
  })
;

module.exports = mongoose.model('MtgCard', MtgCard);
