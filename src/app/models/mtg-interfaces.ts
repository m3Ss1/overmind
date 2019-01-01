declare module 'mtg-interfaces' {
  export interface ImageUris {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  }

  export interface Legalities {
    standard: string;
    future: string;
    frontier: string;
    modern: string;
    legacy: string;
    pauper: string;
    vintage: string;
    penny: string;
    commander: string;
    duel: string;
    brawl: string;
  }

  export interface RelatedUris {
    gatherer: string;
    tcgplayer_decks: string;
    edhrec: string;
    mtgtop8: string;
  }

  export interface PurchaseUris {
    amazon: string;
    ebay: string;
    tcgplayer: string;
    magiccardmarket: string;
    cardhoarder: string;
    card_kingdom: string;
    mtgo_traders: string;
    coolstuffinc: string;
  }

  export interface Card {
    object: string;
    id: string;
    oracle_id: string;
    multiverse_ids: number[];
    mtgo_id: number;
    mtgo_foil_id: number;
    arena_id: number;
    name: string;
    lang: string;
    released_at: string;
    uri: string;
    scryfall_uri: string;
    layout: string;
    highres_image: boolean;
    image_uris: ImageUris;
    mana_cost: string;
    cmc: number;
    type_line: string;
    oracle_text: string;
    colors: string[];
    color_identity: string[];
    legalities: Legalities;
    reserved: boolean;
    foil: boolean;
    nonfoil: boolean;
    oversized: boolean;
    reprint: boolean;
    set: string;
    set_name: string;
    set_uri: string;
    set_search_uri: string;
    scryfall_set_uri: string;
    rulings_uri: string;
    prints_search_uri: string;
    collector_number: string;
    digital: boolean;
    rarity: string;
    flavor_text: string;
    illustration_id: string;
    artist: string;
    frame: string;
    full_art: boolean;
    border_color: string;
    timeshifted: boolean;
    colorshifted: boolean;
    futureshifted: boolean;
    story_spotlight: boolean;
    edhrec_rank: number;
    usd: string;
    tix: string;
    eur: string;
    related_uris: RelatedUris;
    purchase_uris: PurchaseUris;

    /* Personal fields */
    display_number: number; /* storing cards in order to avoid complex parsing of collection_number (e.g. ZEN/230a) */
    collection_count: number;
    in_deck_count: number;
    deck_note: string;
    mana_cost_display: string[];
    purchase_price: number;
    gain_loss: number;
  }

  export interface Set {
    object: string;
    code: string;
    mtgo_code: string;
    name: string;
    uri: string;
    scryfall_uri: string;
    search_uri: string;
    released_at: string;
    set_type: string;
    card_count: number;
    digital: boolean;
    foil_only: boolean;
    block_code: string;
    block: string;
    icon_svg_uri: string;
  }

}
