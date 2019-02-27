import { Component, OnInit } from '@angular/core';
import {DeckCard} from 'mtg-interfaces';

@Component({
  selector: 'app-deck-manager',
  templateUrl: './deck-manager.component.html',
  styleUrls: ['./deck-manager.component.css']
})
export class DeckManagerComponent implements OnInit {

  textAreaContent: String = '1 Llanowar Elves\r\n10 Mountain';
  deckCard: DeckCard;

  constructor() { }

  ngOnInit() {
  }

  importDeck() {
    if (this.textAreaContent) {
      const lines = this.textAreaContent.split(/\r\n|\r|\n/g);
      for (const line of lines) {
        const tokens = line.trim().split(/ (.+)/);
        const quantity = tokens[0];
        const name = tokens[1];
        // persist card
      }
    }
  }

  /*
  1 Llanowar Elves
  10 Mountain
  */
}
