// Angular
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
// 3rd party
// App
import {AppComponent} from './app.component';
import {ListComicsComponent} from './comics/components/list-comics/list-comics.component';
import {ComicsService} from './comics/comics.service';
import {ScryImportComponent} from './mtg/components/scry-import/scry-import.component';
import {MtgDashboardComponent} from './mtg/components/mtg-dashboard/mtg-dashboard.component';
import {MtgService} from './mtg/mtg.service';


const routes: Routes = [
    {
      path: 'comics',
      component: ListComicsComponent
    },
    {
      path: 'mtg-dashboard',
      component: MtgDashboardComponent
    },
    {
      path: 'mtg-scry-import',
      component: ScryImportComponent
    }
  ]
;

@NgModule({
  declarations: [
    AppComponent,
    ListComicsComponent,
    ScryImportComponent,
    MtgDashboardComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule
  ],
  providers: [
    ComicsService,
    MtgService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
