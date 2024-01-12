import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphComponent } from './graph/graph.component';
import { TableComponent } from './table/table.component';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { BrowserModule } from '@angular/platform-browser';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@NgModule({
  declarations: [GraphComponent, TableComponent],
  imports: [
    CommonModule,
    TableModule,
    PaginatorModule,
    DropdownModule,
    InputMaskModule,
    BrowserModule,
    ProgressSpinnerModule,
  ],
})
export class ViewerModule {}
