import {Component, OnInit} from '@angular/core';
import {MtgService} from '../../mtg.service';
import {Card, Set} from 'mtg-interfaces';

@Component({
  selector: 'app-scry-import',
  templateUrl: './scry-import.component.html',
  styleUrls: ['./scry-import.component.css']
})
export class ScryImportComponent implements OnInit {

  code: string;
  importStatus = '';
  set: Set;
  cards: Card[] = [];

  constructor(private mtgService: MtgService) {
  }

  ngOnInit() {
  }

  fetch(code: string, page: number = 1, displayNumber: number = 1) {

    code = code.trim().toLowerCase();

    // first step, retrieve set information (only once)
    if (!this.set) {
      this.mtgService.fetchSet(code).subscribe(
        set => {
          this.set = set;
          this.importStatus += 'Set information retrieved\n';
        });
    }

    const start: number = Date.now();
    this.mtgService.fetchCards(code, page).subscribe(
      list => {
        this.importStatus += 'Page ' + page + ' received in ' + ((Date.now() - start) / 1000) + 's\n';
        const items: Card[] = list.data;
        for (const item of items) {
          item.display_number = displayNumber++;
          this.cards.push(item);
        }

        // recursive push for additional pages
        if (list.has_more) {
          this.fetch(code, ++page, displayNumber);
        } else {
          this.importStatus += 'Fetch complete\n-----------------\n';
        }
      }
    );
  }

  reset() {
    this.cards = [];
    this.set = null;
    this.importStatus = '';
  }

  persistFetched() {
    // persist the set
    this.mtgService.persistSet(this.set).subscribe(
      status => {
        this.importStatus += 'Set added/updated: ';
        if (status.ok === 1) {
          this.importStatus += 'ok';
        } else {
          this.importStatus += 'error';
        }
        this.importStatus += '\n';
      }
    );

    // persist the cards
    this.mtgService.persistCards(this.cards).subscribe(
      res => this.importStatus += 'Cards added/updated: ' + res.status + '\n'
    );
  }

  addCard(card: Card) {
    const cards: Card[] = [];
    cards.push(card);
    this.mtgService.persistCards(cards).subscribe(res => {
      this.importStatus += 'Card added:' + res.status + '\n';
    });
  }
}
