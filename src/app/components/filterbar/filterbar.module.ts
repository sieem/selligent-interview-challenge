import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterbarComponent } from './filterbar.component';
import { SearchModule } from '../search/search.module';

@NgModule({
  imports: [CommonModule, SearchModule, ReactiveFormsModule],
  declarations: [FilterbarComponent],
  exports: [FilterbarComponent],
})
export class FilterbarModule { }
