import {CardSummary} from 'mtg-interfaces';

export class MtgCardSummary implements CardSummary {
  name: string;
  quantity: number;

  constructor(name: string, quantity: number) {
    this.name = name;
    this.quantity = quantity;
  }

}
