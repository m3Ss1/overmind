import {Component, OnInit} from '@angular/core';
import {Card, Set} from 'mtg-interfaces';
import {MtgService} from '../../mtg.service';

@Component({
  selector: 'app-mtg-dashboard',
  templateUrl: './mtg-dashboard.component.html',
  styleUrls: ['./mtg-dashboard.component.css']
})
export class MtgDashboardComponent implements OnInit {

  mtgSets: Set[] = [];
  selectedSet: Set;
  mtgCards: Card[] = [];

  private static populateManaCostDisplay(cards: Card[]) {
    for (const card of cards) {
      card.mana_cost_display = [];

      const regex = /({(.*?)}|(\/\/))/gi;
      let m;
      while ((m = regex.exec(card.mana_cost)) !== null) {
        if (m.index === regex.lastIndex) { regex.lastIndex++; }

        if (m[0] === '//') {
          // special double/split cards
          card.mana_cost_display.push(m[3]);
        } else {
          let styleItem = 'ms-' + m[2];
          styleItem = styleItem.replace('/', '');
          card.mana_cost_display.push(styleItem.toLowerCase());
        }
      }
    }
  }

  constructor(private mtgService: MtgService) {
  }

  ngOnInit() {
    this.refresh();
  }

  private refresh() {
    this.mtgService.getAllSets().subscribe(
      sets => {
        this.mtgSets = sets;
      }
    );
  }

  getCardsBySet(set: Set) {
    this.mtgService.getCardsBySet(set.code).subscribe(
      cards => {
        this.selectedSet = set;
        MtgDashboardComponent.populateManaCostDisplay(cards);
        this.mtgCards = cards;
      }
    );
  }

  deleteSetAndCards(setCode: string) {
    this.mtgService.deleteCardsBySetCode(setCode).subscribe(cardsDeleteStatus =>
      this.mtgService.deleteSetByCode(setCode).subscribe(setDeleteStatus => {
        this.refresh();
        this.selectedSet = null;
      })
    );
  }

  increaseOwnedByOne(card: Card) {
    card.collection_count++;
    this.mtgService.updateCard(card).subscribe();
  }

  decreaseOwnedByOne(card: Card) {
    card.collection_count--;
    if (card.collection_count < 0) {
      card.collection_count = 0;
    }
    if (card.in_deck_count > card.collection_count) {
      card.in_deck_count--;
    }
    this.mtgService.updateCard(card).subscribe();
  }

  increaseInDeckByOne(card: Card) {
    card.in_deck_count++;
    if (card.in_deck_count > card.collection_count) {
      card.in_deck_count--;
      return;
    }
    this.mtgService.updateCard(card).subscribe();
  }

  decreaseInDeckByOne(card: Card) {
    card.in_deck_count--;
    if (card.in_deck_count < 0) {
      card.in_deck_count = 0;
    }
    this.mtgService.updateCard(card).subscribe();
  }

  storeDeckNote(card: Card) {
    this.mtgService.updateCard(card).subscribe();
  }

  filterTable(searchString: String) {
    this.mtgService.getCardsBySetWithFilter(this.selectedSet.code, searchString)
      .subscribe(
        cards => {
          MtgDashboardComponent.populateManaCostDisplay(cards);
          this.mtgCards = cards;
        }
      );
  }
}
