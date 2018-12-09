import {Component, OnInit, ViewChild} from '@angular/core';
import {Card, Set} from 'mtg-interfaces';
import {MtgService} from '../../mtg.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-mtg-dashboard',
  templateUrl: './mtg-dashboard.component.html',
  styleUrls: ['./mtg-dashboard.component.css']
})
export class MtgDashboardComponent implements OnInit {

  mtgSets: Set[] = [];
  selectedSet: Set;
  mtgCards: Card[] = [];

  displayedColumns: string[] = ['number', 'rarity', 'name', 'type', 'cost', 'value', 'owned', 'in_deck', 'deck_notes'];
  dataSource: MatTableDataSource<Card>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

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

  reset() {
    this.mtgCards = null;
    this.selectedSet = null;
    this.dataSource = null;
    this.paginator = null;
  }

  getCardsBySet(set: Set) {
    this.selectedSet = set;
    this.mtgService.getCardsBySet(set.code).subscribe(
      cards => {
        MtgDashboardComponent.populateManaCostDisplay(cards);
        this.dataSource = new MatTableDataSource<Card>(cards);
        this.dataSource.paginator = this.paginator;
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
