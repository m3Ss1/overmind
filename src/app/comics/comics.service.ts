import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';
import {Comic, Serie} from 'comics-interfaces';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ComicsService {

  constructor(private http: HttpClient) {
  }

  private static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  getAllComicSeries(): Observable<Serie[]> {
    return this.http
      .get<Serie[]>(API_URL + '/api/comics/seriesCount')
      .pipe(catchError(ComicsService.handleError));
  }

  getComicsBySerie(serieId: string): Observable<Comic[]> {
    return this.http
      .get<Comic[]>(API_URL + '/api/comics/bySerie/' + encodeURI(serieId))
      .pipe(catchError(ComicsService.handleError));
  }

  getMissingComics(): Observable<Comic[]> {
    return this.http
      .get<Comic[]>(API_URL + '/api/comics/missing')
      .pipe(catchError(ComicsService.handleError));
  }

  updateComic(comic): Observable<Comic> {
    return this.http
      .put<Comic>(API_URL + '/api/comics/update', comic)
      .pipe(catchError(ComicsService.handleError));
  }

  createComic(comic): Observable<Comic> {
    return this.http
      .post<Comic>(API_URL + '/api/comics/add', comic)
      .pipe(catchError(ComicsService.handleError));
  }

  deleteComic(comicId: String): Observable<any> {
    return this.http
      .delete(API_URL + '/api/comics/delete/' + comicId)
      .pipe(catchError(ComicsService.handleError));
  }

}
