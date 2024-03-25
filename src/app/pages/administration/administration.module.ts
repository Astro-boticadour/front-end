import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ProjectsComponent } from './projects/projects.component';
import { UsersComponent } from './users/users.component';
import { RessourcesComponent } from './ressources/ressources.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { AdministrationComponent } from './administration.component';

@NgModule({
  declarations: [
    ProjectsComponent,
    UsersComponent,
    RessourcesComponent,
    AdministrationComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    CheckboxModule,
    ProgressSpinnerModule,
    DropdownModule,
    TabViewModule,
  ],
})
export class AdministrationModule {}
