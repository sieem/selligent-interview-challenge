import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AppComponent } from './app.component';
import { OverviewComponent } from './components/overview/overview.component';
import { routes } from './routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoRootModule } from './transloco-root.module';
import { FilterbarModule } from './components/filterbar/filterbar.module';

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TranslocoRootModule,
    FilterbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
