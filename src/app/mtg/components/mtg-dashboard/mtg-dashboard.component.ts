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
  selectedSetCode: string;
  selectedCards: Card[];
  selectedRarity: string;
  showOnlyMissing: boolean;
  displayExport: boolean;

  ownedCount: number;
  buyPrice: number;

  totalShown: number;
  totalSetCost: number;
  totalOwnedSetCost: number;
  totalBuyPrice: number;
  totalGainLoss: number;
  totalOwnedCards: number;
  totalInDeckCards: number;
  page: number;
  pageSize: number;

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
      card.gain_loss = ((Number(card.eur) * Constants.EUR_TO_CHF_FX) - card.purchase_price) * (card.collection_count > 0 ? 1 : 0);
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
    this.page = 1;
    this.pageSize = 10;
    this.selectedRarity = 'all';
    this.showOnlyMissing = false;
    this.mtgService.getAllSets().subscribe(sets => {
      this.mtgSets = sets;
    });
  }

  recalculateTotals() {
    this.totalShown = 0;
    this.totalSetCost = 0;
    this.totalOwnedSetCost = 0;
    this.totalBuyPrice = 0;
    this.totalGainLoss = 0;
    this.totalOwnedCards = 0;
    this.totalInDeckCards = 0;

    if (this.selectedCards) {
      for (const card of this.selectedCards) {
        this.totalShown += 1;

        if (card.eur != null) {
          this.totalSetCost += Number(card.eur);
          this.totalOwnedSetCost += Number(card.eur) * (card.collection_count > 0 ? 1 : 0);
        }

        if (card.purchase_price != null) {
          this.totalBuyPrice += Number(card.purchase_price) * (card.collection_count > 0 ? 1 : 0);
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

  setOwnedCount() {
    if (this.ownedCount && this.selectedCards) {
      for (const card of this.selectedCards) {
        card.collection_count = this.ownedCount;
        this.updateCard(card);
      }
    }
    this.ownedCount = null;
  }

  setBuyPrice() {
    if (this.buyPrice && this.selectedCards) {
      for (const card of this.selectedCards) {
        card.purchase_price = this.buyPrice;
        this.updateCard(card);
      }
    }
    this.buyPrice = null;
  }

  getCardsFilter(setCode: string, rarity: string, onlyMissing: boolean) {
    this.selectedCards = null;
    this.totalSetCost = null;
    this.mtgService.getCardsFilter(setCode, rarity, onlyMissing).subscribe(
      cards => {
        MtgDashboardComponent.populateManaCostDisplay(cards);
        this.selectedCards = cards;
        this.recalculateTotals();
      }
    );
  }

  getNotInSetCards() {
    this.selectedCards = null;
    this.selectedSet = null;
    this.mtgService.getNotInSetCards().subscribe(cards => {
      this.selectedCards = cards;
      this.recalculateTotals();
    });
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

  getStringExport() {
    if (!this.selectedCards) {
      return;
    }

    let exportList = '';
    for (const card of this.selectedCards) {
      exportList += '1 ' + card.name + ' (' + card.set_name + ')\n';
    }
    return exportList;
  }
}

@Component({
  selector: 'app-mtg-img-modal-content',
  template: `<img [ngStyle]="{'width': imageUris.length > 1 ? '249px' : '300px'}" alt="" *ngFor="let imageUri of imageUris"
                  src="{{imageUri}}"/>`
})
export class MtgImgModalContentComponent {
  @Input() imageUris;

  constructor() {
  }
}
