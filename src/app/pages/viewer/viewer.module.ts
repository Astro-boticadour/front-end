import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphComponent } from './graph/graph.component';
import { TableComponent } from './table/table.component';



@NgModule({
  declarations: [
    GraphComponent,
    TableComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ViewerModule { }
