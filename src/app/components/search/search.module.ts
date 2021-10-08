import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './search.component';

@NgModule({
  imports: [CommonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  declarations: [SearchComponent],
  exports: [SearchComponent],
})
export class SearchModule { }
