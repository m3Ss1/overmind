import {MtgCardSummary} from './MtgCardSummary';
import {Deck} from 'mtg-interfaces';

export class MtgDeck implements Deck {
  name: string;
  cards: MtgCardSummary[];

  constructor(name: string) {
    this.name = name;
    this.cards = [];
  }

}
