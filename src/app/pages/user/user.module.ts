import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentComponent } from './current/current.component';
import { HistoryComponent } from './history/history.component';
import { NosessionComponent } from './current/nosession/nosession.component';
import { RunningsessionComponent } from './current/runningsession/runningsession.component';
import { InitsessionComponent } from './current/initsession/initsession.component';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    CurrentComponent,
    HistoryComponent,
    NosessionComponent,
    RunningsessionComponent,
    InitsessionComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    ButtonModule,
    ListboxModule,
    ProgressSpinnerModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class UserModule {}
