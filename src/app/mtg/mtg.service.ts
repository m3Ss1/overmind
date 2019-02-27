import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Card, Deck, Set} from 'mtg-interfaces';
import {environment} from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class MtgService {

  constructor(private http: HttpClient) {
  }

  fetchCards(code: string, page: number): Observable<any> {
    return this.http
      .get('https://api.scryfall.com/cards/search?format=json&include_extras=false&order=set&page=' + page + '&q=s%3A' + code + '&unique=prints');
  }

  fetchSet(code: string): Observable<Set> {
    return this.http.get<Set>('https://api.scryfall.com/sets/' + code);
  }

  persistSet(set: Set): Observable<any> {
    return this.http.post(API_URL + '/api/mtg/set/add', set);
  }

  persistCards(cards: Card[]): Observable<any> {
    return this.http.post(API_URL + '/api/mtg/card/add/all', cards);
  }

  deleteCardsBySetCode(setCode: string): Observable<any> {
    return this.http.delete(API_URL + '/api/mtg/card/delete/' + setCode);
  }

  deleteSetByCode(setCode: string): Observable<any> {
    return this.http.delete(API_URL + '/api/mtg/set/delete/' + setCode);
  }

  getAllSets(): Observable<Set[]> {
    return this.http.get<Set[]>(API_URL + '/api/mtg/set/all');
  }

  getCardsFilter(setCode: string, rarity: string, onlyMissing: boolean): Observable<Card[]> {
    return this.http.get<Card[]>(API_URL + '/api/mtg/card/filter/' + setCode + '/' + rarity + '/' + onlyMissing);
  }

  updateCard(card: Card): Observable<Card> {
    return this.http.put<Card>(API_URL + '/api/mtg/card/update', card);
  }

  getNotInSetCards(): Observable<Card[]> {
    return this.http.get<Card[]>(API_URL + '/api/mtg/card/notInSet');
  }

  persistDeck(deck: Deck) {
    return this.http.post(API_URL + '/api/mtg/deck/add', deck);
  }
}
