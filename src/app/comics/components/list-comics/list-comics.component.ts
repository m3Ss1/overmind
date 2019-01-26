import {Component, OnInit} from '@angular/core';
import {Comic, Serie} from 'comics-interfaces';
import {ComicsService} from '../../comics.service';


@Component({
  selector: 'app-list-comics',
  templateUrl: './list-comics.component.html',
  styleUrls: ['./list-comics.component.css']
})
export class ListComicsComponent implements OnInit {

  series: Serie[] = [];
  selectedSerie: Serie;
  comics: Comic[] = null;

  constructor(private comicsService: ComicsService) {
  }

  static nextMonth(date: Date) {
    const curDate = new Date(date);
    let month = curDate.getMonth();
    let year = curDate.getFullYear();

    if (month < 12) {
      month++;
    } else {
      month = 1;
      year++;
    }

    return new Date(year, month);
  }

  ngOnInit() {
    this.comicsService
      .getAllComicSeries()
      .subscribe(series => this.series = series);
  }

  getComicsBySerie(serie: Serie) {
    this.comicsService
      .getComicsBySerie(serie._id)
      .subscribe(
        comics => {
          this.selectedSerie = serie;
          this.comics = comics;
        });
  }

  getMissingComics() {
    this.selectedSerie = null;
    this.comicsService.getMissingComics().subscribe(missingComics => {
      this.comics = missingComics;
    });
  }

  updateComic(comic: Comic) {
    this.comicsService.updateComic(comic).subscribe();
  }

  toggleArchive(comic: Comic) {
    comic.archived = !comic.archived;
    this.comicsService.updateComic(comic)
      .subscribe(() => {
        if (comic.archived) {
          this.selectedSerie.archived++;
        } else {
          this.selectedSerie.archived--;
        }
      });
  }

  toggleRead(comic: Comic) {
    comic.read = !comic.read;
    if (comic.read) {
      comic.read_date = new Date();
    } else {
      comic.read_date = null;
    }
    this.comicsService.updateComic(comic)
      .subscribe(() => {
        if (comic.read) {
          this.selectedSerie.read++;
        } else {
          this.selectedSerie.read--;
        }
      });
  }

  duplicate(comic: Comic) {
    const target: Comic = JSON.parse(JSON.stringify(comic));
    delete target['_id'];
    target.serie_number = comic.serie_number + 1;
    target.title = '';
    target.pages = comic.pages;
    target.release_date = ListComicsComponent.nextMonth(comic.release_date);
    target.in_collection = false;
    target.read = false;
    target.read_date = null;

    this.comicsService.createComic(target)
      .subscribe(createdComic => {
        this.comics.push(createdComic);
        this.comics.sort((a, b) => a.serie_number - b.serie_number);
        this.selectedSerie.total++;
      });
  }

  remove(comic: Comic) {
    this.comicsService.deleteComic(comic._id)
      .subscribe(() => {
        this.comics = this.comics.filter(item => item !== comic);
        if (comic.read) {
          this.selectedSerie.read--;
        }
        if (comic.archived) {
          this.selectedSerie.archived--;
        }
        this.selectedSerie.total--;
      });
  }

}
