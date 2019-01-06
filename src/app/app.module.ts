// Angular
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import 'hammerjs';
// App
import {AppComponent} from './app.component';
import {ListComicsComponent} from './comics/components/list-comics/list-comics.component';
import {ComicsService} from './comics/comics.service';
import {ScryImportComponent} from './mtg/components/scry-import/scry-import.component';
import {MtgDashboardComponent, MtgImgModalContentComponent} from './mtg/components/mtg-dashboard/mtg-dashboard.component';
import {MtgService} from './mtg/mtg.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


const routes: Routes = [
    {path: 'comics', component: ListComicsComponent},
    {path: 'mtg-dashboard', component: MtgDashboardComponent},
    {path: 'mtg-scry-import', component: ScryImportComponent}
  ]
;

@NgModule({
  declarations: [
    AppComponent,
    ListComicsComponent,
    ScryImportComponent,
    MtgDashboardComponent,
    MtgImgModalContentComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    ComicsService,
    MtgService
  ],
  bootstrap: [AppComponent],
  entryComponents: [MtgImgModalContentComponent]
})

export class AppModule {
}
