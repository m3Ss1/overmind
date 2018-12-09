// Angular
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatFormFieldModule, MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule, MatOptionModule,
  MatPaginatorModule, MatSelectModule,
  MatSidenavModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import 'hammerjs';
import {LayoutModule} from '@angular/cdk/layout';
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
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatGridListModule,
    LayoutModule
  ],
  providers: [
    ComicsService,
    MtgService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
