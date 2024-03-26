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
import { TabViewModule } from 'primeng/tabview';
import { ViewerComponent } from './viewer.component';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [GraphComponent, TableComponent, ViewerComponent],
  imports: [
    CommonModule,
    TableModule,
    PaginatorModule,
    DropdownModule,
    InputMaskModule,
    BrowserModule,
    ProgressSpinnerModule,
    TabViewModule,
    ButtonModule,
    ChartModule,
  ],
})
export class ViewerModule {}
