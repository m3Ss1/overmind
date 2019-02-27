import {Component, OnInit} from '@angular/core';
import {MtgService} from '../../mtg.service';
import {CardSummary, Deck} from 'mtg-interfaces';

@Component({
  selector: 'app-deck-manager',
  templateUrl: './deck-manager.component.html',
  styleUrls: ['./deck-manager.component.css']
})
export class DeckManagerComponent implements OnInit {

  rightLogArea: String[] = [];
  textAreaContent: String = '1 Llanowar Elves\r\n10 Mountain';

  constructor(private mtgService: MtgService) {
  }

  ngOnInit() {
  }

  importDeck() {
    if (this.textAreaContent) {
      const deck: Deck = new class implements Deck {
        cards: CardSummary[] = [];
        name: string;
      };
      deck.name = 'Test Deck';
      const lines = this.textAreaContent.split(/\r\n|\r|\n/g);
      for (const line of lines) {
        if (line.trim().length === 0) {
          continue;
        }
        const tokens = line.trim().split(/ (.+)/);
        const cardSummary: CardSummary = new class implements CardSummary {
          name: string;
          quantity: number;
        };
        cardSummary.name = tokens[1];
        cardSummary.quantity = Number(tokens[0]);
        deck.cards.push(cardSummary);
      }
      // persist deck
      this.mtgService.persistDeck(deck).subscribe(res => {
        this.rightLogArea.push(JSON.stringify(res));
      });
    }
  }

  /*
  1 Llanowar Elves
  10 Mountain
  */
}
