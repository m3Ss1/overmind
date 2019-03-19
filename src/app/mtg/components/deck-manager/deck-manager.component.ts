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
  decks: Deck[] = [];
  selectedDeck: Deck;
  textAreaContent: string;
  analyzedCards = new Map();

  constructor(private mtgService: MtgService) {
  }

  ngOnInit() {
    this.getAllDecks();
  }

  getAllDecks() {
    this.mtgService.getAllDecks().subscribe(res => {
      this.decks = res;
    });
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
        this.getAllDecks();
      });
    }
  }

  deckToString(deck: Deck) {
    this.selectedDeck = deck;
    this.deckTitle = deck.name;
    this.textAreaContent = '';
    for (const card of deck.cards) {
      this.textAreaContent += card.quantity + ' ' + card.name + '\n';
    }
  }

  removeDeck(deck: Deck) {
    this.mtgService.deleteDeck(deck).subscribe(res => {
      this.rightLogArea.push(JSON.stringify(res));
      this.getAllDecks();
    });
  }

  analyzeDeck() {
    if (this.selectedDeck) {
      const cardNames: String[] = [];
      for (const card of this.selectedDeck.cards) {
        cardNames.push(card.name);
      }
      this.mtgService.findCards(cardNames).subscribe(res => {
        // Build the map for display
        for (const deckCard of this.selectedDeck.cards) {
          this.analyzedCards.set(deckCard.name, []);
          for (const foundCard of res) {
            if (foundCard.name === deckCard.name) {
              this.analyzedCards.get(deckCard.name).push(foundCard);
            }
          }
        }
      });
    }
  }
}
