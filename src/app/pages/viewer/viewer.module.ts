import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphComponent } from './graph/graph.component';
import { TableComponent } from './table/table.component';
import {TableModule} from "primeng/table";
import {PaginatorModule} from "primeng/paginator";



@NgModule({
  declarations: [
    GraphComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    PaginatorModule
  ]
})
export class ViewerModule { }
