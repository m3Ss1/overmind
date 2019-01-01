import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {Card, Set} from 'mtg-interfaces';
import {MtgService} from '../../mtg.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatTableDataSource} from '@angular/material';
import {Constants} from '../../../constants';

@Component({
  selector: 'app-mtg-dashboard',
  templateUrl: './mtg-dashboard.component.html',
  styleUrls: ['./mtg-dashboard.component.css']
})
export class MtgDashboardComponent implements OnInit {

  mtgSets: Set[] = [];
  selectedSet: Set;
  totalGainLoss: number;
  manualUpdateValue: number;
  readonly EUR_TO_CHF_FX = Constants.EUR_TO_CHF_FX;

  displayedColumns: string[] = ['number', 'rarity', 'name', 'type', 'cost', 'value', 'buy_price', 'gain_loss', 'owned', 'in_deck', 'deck_notes'];
  dataSource: MatTableDataSource<Card>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private static populateManaCostDisplay(cards: Card[]) {
    for (const card of cards) {
      card.mana_cost_display = [];

      const regex = /({(.*?)}|(\/\/))/gi;
      let m;
      while ((m = regex.exec(card.mana_cost)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

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

  private static updateGainLossValue(card: Card) {
    /* Update gain/loss price */
    if (card.eur && card.purchase_price && card.collection_count > 0) {
      card.gain_loss = ((Number(card.eur) * Constants.EUR_TO_CHF_FX) - card.purchase_price) * card.collection_count;
    } else {
      card.gain_loss = 0;
    }
  }

  constructor(private mtgService: MtgService, public dialog: MatDialog) {
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

  recalculateTotalGainLoss() {
    let tot = 0;
    if (this.dataSource && this.dataSource.data) {
      for (const mtgCard of this.dataSource.data) {
        MtgDashboardComponent.updateGainLossValue(mtgCard);
        if (!isNaN(mtgCard.gain_loss)) {
          tot += mtgCard.gain_loss;
        }
      }
    }
    this.totalGainLoss = tot;
  }

  reset() {
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
        this.recalculateTotalGainLoss();
      }
    );
  }

  getAllCards() {
    this.selectedSet = null;
    this.mtgService.getAllCards().subscribe(
      cards => {
        MtgDashboardComponent.populateManaCostDisplay(cards);
        this.dataSource = new MatTableDataSource<Card>(cards);
        this.dataSource.paginator = this.paginator;
        this.recalculateTotalGainLoss();
      }
    );
  }

  getMissingCards() {
    this.selectedSet = null;
    this.mtgService.getMissingCards().subscribe(
      cards => {
        MtgDashboardComponent.populateManaCostDisplay(cards);
        this.dataSource = new MatTableDataSource<Card>(cards);
        this.dataSource.paginator = this.paginator;
        this.recalculateTotalGainLoss();
      }
    );
  }

  getTokens() {
    this.selectedSet = null;
    this.mtgService.getTokens().subscribe(
      cards => {
        this.dataSource = new MatTableDataSource<Card>(cards);
        this.dataSource.paginator = this.paginator;
        this.recalculateTotalGainLoss();
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
    this.recalculateTotalGainLoss();
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
    this.recalculateTotalGainLoss();
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

  updateCard(card: Card) {
    this.recalculateTotalGainLoss();
    this.mtgService.updateCard(card).subscribe();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  modifyAllBuyPrice(inputValue: number) {
    if (this.dataSource && this.dataSource.data) {
      for (const mtgCard of this.dataSource.data) {
        mtgCard.purchase_price = inputValue;
        this.updateCard(mtgCard);
      }
    }
  }

  increaseAllOwnedByOne() {
    if (this.dataSource && this.dataSource.data) {
      for (const mtgCard of this.dataSource.data) {
        this.increaseOwnedByOne(mtgCard);
      }
    }
  }

  decreaseAllOwnedByOne() {
    if (this.dataSource && this.dataSource.data) {
      for (const mtgCard of this.dataSource.data) {
        this.decreaseOwnedByOne(mtgCard);
      }
    }
  }

  openDialog(card: Card) {
    const imageUris = [];
    if (card.image_uris) {
      imageUris.push(card.image_uris.border_crop);
    } else if (card.card_faces && card.card_faces.length > 0) {
      for (const cardFace of card.card_faces) {
        imageUris.push(cardFace.image_uris.border_crop);
      }
    }
    this.dialog.open(CardImageDialogComponent, {data: imageUris});
  }
}

@Component({
  selector: 'app-mtg-dashboard-dialog',
  template: '<div class="display: flex"><img *ngFor="let imageUri of data" alt="" src="{{imageUri}}"/></div>',
})
export class CardImageDialogComponent {

  constructor(public dialogRef: MatDialogRef<CardImageDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: string[]) {
  }

}
