import {Component, Input, OnInit} from '@angular/core';
import {Card, Set} from 'mtg-interfaces';
import {MtgService} from '../../mtg.service';
import {Constants} from '../../../constants';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mtg-dashboard',
  templateUrl: './mtg-dashboard.component.html',
  styleUrls: ['./mtg-dashboard.component.css']
})
export class MtgDashboardComponent implements OnInit {

  readonly EUR_TO_CHF_FX = Constants.EUR_TO_CHF_FX;
  readonly TRIM_LENGTH = Constants.TRIM_LENGTH;

  mtgSets: Set[] = [];
  selectedSet: Set;
  selectedCards: Card[];

  totalSetCost: number;
  totalBuyPrice: number;
  totalGainLoss: number;
  totalOwnedCards: number;
  totalInDeckCards: number;

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

  private static extractImageUris(card: Card): string[] {
    const imageUris = [];
    if (card.image_uris) {
      imageUris.push(card.image_uris.border_crop);
    } else if (card.card_faces && card.card_faces.length > 0) {
      for (const cardFace of card.card_faces) {
        imageUris.push(cardFace.image_uris.border_crop);
      }
    }
    return imageUris;
  }

  constructor(private mtgService: MtgService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.refresh();
  }

  private refresh() {
    this.mtgService.getAllSets().subscribe(sets => {
        this.mtgSets = sets;
    });
  }

  recalculateTotals() {
    this.totalSetCost = 0;
    this.totalBuyPrice = 0;
    this.totalGainLoss = 0;
    this.totalOwnedCards = 0;
    this.totalInDeckCards = 0;

    if (this.selectedCards) {
      for (const card of this.selectedCards) {

        if (card.eur != null) {
          this.totalSetCost += Number(card.eur);
        }

        if (card.purchase_price != null) {
          this.totalBuyPrice += Number(card.purchase_price);
        }

        MtgDashboardComponent.updateGainLossValue(card);
        if (card.gain_loss != null) {
          this.totalGainLoss += Number(card.gain_loss);
        }

        if (card.collection_count != null) {
          this.totalOwnedCards += Number(card.collection_count);
        }

        if (card.in_deck_count != null) {
          this.totalInDeckCards += Number(card.in_deck_count);
        }
      }
    }
  }

  reset() {
    this.selectedSet = null;
    this.selectedCards = null;
  }

  getCardsBySet(set: Set) {
    this.selectedSet = set;
    this.selectedCards = null;
    this.mtgService.getCardsBySet(set.code).subscribe(
      cards => {
        MtgDashboardComponent.populateManaCostDisplay(cards);
        this.selectedCards = cards;
        this.recalculateTotals();
      }
    );
  }

  getAllCards() {
    this.selectedSet = null;
    this.selectedCards = null;
    this.mtgService.getAllCards().subscribe(
      cards => {
        MtgDashboardComponent.populateManaCostDisplay(cards);
        this.selectedCards = cards;
        this.recalculateTotals();
      }
    );
  }

  getMissingCards() {
    this.selectedSet = null;
    this.selectedCards = null;
    this.mtgService.getMissingCards().subscribe(
      cards => {
        MtgDashboardComponent.populateManaCostDisplay(cards);
        this.selectedCards = cards;
        this.recalculateTotals();
      }
    );
  }

  getTokens() {
    this.selectedSet = null;
    this.selectedCards = null;
    this.mtgService.getTokens().subscribe(
      cards => {
        this.selectedCards = cards;
        this.recalculateTotals();
      }
    );
  }

  deleteSetAndCards(setCode: string) {
    this.mtgService.deleteCardsBySetCode(setCode).subscribe(() =>
      this.mtgService.deleteSetByCode(setCode).subscribe(() => {
        this.refresh();
        this.selectedSet = null;
      })
    );
  }

  increaseOwnedByOne(card: Card) {
    card.collection_count++;
    this.recalculateTotals();
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
    this.recalculateTotals();
    this.mtgService.updateCard(card).subscribe();
  }

  increaseInDeckByOne(card: Card) {
    card.in_deck_count++;
    if (card.in_deck_count > card.collection_count) {
      card.in_deck_count--;
      return;
    }
    this.recalculateTotals();
    this.mtgService.updateCard(card).subscribe();
  }

  decreaseInDeckByOne(card: Card) {
    card.in_deck_count--;
    if (card.in_deck_count < 0) {
      card.in_deck_count = 0;
    }
    this.recalculateTotals();
    this.mtgService.updateCard(card).subscribe();
  }

  updateCard(card: Card) {
    this.recalculateTotals();
    this.mtgService.updateCard(card).subscribe();
  }

  modifyAllBuyPrice(inputValue: number) {
    if (this.selectedCards) {
      for (const mtgCard of this.selectedCards) {
        mtgCard.purchase_price = inputValue;
        this.updateCard(mtgCard);
      }
    }
  }

  openDialog(card: Card) {
    const uris = MtgDashboardComponent.extractImageUris(card);
    let size;
    uris.length > 1 ? size = '' : size = 'sm';
    const modalRef = this.modalService.open(MtgImgModalContentComponent, {centered: true, size: size});
    modalRef.componentInstance.imageUris = uris;
  }

}

@Component({
  selector: 'app-mtg-img-modal-content',
  template: `<img [ngStyle]="{'width': imageUris.length > 1 ? '249px' : '300px'}" alt="" *ngFor="let imageUri of imageUris" src="{{imageUri}}"/>`
})
export class MtgImgModalContentComponent {
  @Input() imageUris;
  constructor() {}
}
