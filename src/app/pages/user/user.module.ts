import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentComponent } from './current/current.component';
import { HistoryComponent } from './history/history.component';

@NgModule({
  declarations: [CurrentComponent, HistoryComponent],
  imports: [CommonModule],
})
export class UserModule {}
