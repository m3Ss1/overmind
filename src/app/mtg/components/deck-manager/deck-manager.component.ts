import {Component, OnInit} from '@angular/core';
import {MtgService} from '../../mtg.service';
import {CardSummary, Deck} from 'mtg-interfaces';

@Component({
  selector: 'app-deck-manager',
  templateUrl: './deck-manager.component.html',
  styleUrls: ['./deck-manager.component.css']
})
export class DeckManagerComponent implements OnInit {

  deckTitle: string;
  rightLogArea: string[] = [];
  textAreaContent: string;

  constructor(private mtgService: MtgService) {
  }

  ngOnInit() {
    this.deckTitle = 'Test Deck';
    this.textAreaContent = '1 Llanowar Elves\r\n10 Mountain';
  }

  importDeck() {
    if (this.textAreaContent) {
      const deck = {} as Deck;
      deck.name = this.deckTitle;
      deck.cards = [];

      const lines = this.textAreaContent.split(/\r\n|\r|\n/g);
      for (const line of lines) {
        if (line.trim().length === 0) {
          continue;
        }
        const tokens = line.trim().split(/ (.+)/);
        const summary = {} as CardSummary;
        summary.name = tokens[1];
        summary.quantity = Number(tokens[0]);
        deck.cards.push(summary);
      }
      // persist deck
      this.mtgService.persistDeck(deck).subscribe(res => {
        this.rightLogArea.push(JSON.stringify(res));
      });
    }
  }

}
