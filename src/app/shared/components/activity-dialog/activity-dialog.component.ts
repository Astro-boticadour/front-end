import { Component, HostListener } from '@angular/core';
import { ActivityService } from '../../services/activity.service';
import { Observable, filter } from 'rxjs';
import { ActivityEnum } from '../../enums/activity.model';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { user } from '../../interfaces/utilisateur.interface';
import { ApiService } from '../../services/api.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-activity-dialog',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './activity-dialog.component.html',
  styleUrl: './activity-dialog.component.scss',
})
export class ActivityDialogComponent {
  public username!: string;
  public password!: string;

  public currentActivity$: Observable<ActivityEnum>;
  public dialogPart: string;
  public ActivityEnum = ActivityEnum; // makes ActivityEnum enum available in the template

  public userList: user[] = [];
  public filteredUserList: user[] = [];

  constructor(
    private activityService: ActivityService,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.dialogPart = 'activity';
    this.currentActivity$ = this.activityService.getCurrentObservable();

    this.apiService.getAllUser().subscribe((data) => {
      this.userList = data;
      this.filterUser();
    });
  }

  public switchTo(targetActivity: ActivityEnum, user?: user) {
    this.activityService.setActivity(targetActivity, user);
    this.activityService.closeActivityDialog();
  }

  public connect() {
    this.authService.login(this.username, this.password).subscribe((data) => {
      if (data) {
        this.activityService.setActivity(ActivityEnum.Administrator);
        this.activityService.closeActivityDialog();
      }
    });
  }

  public filterUser(event?: Event) {
    let filterValue = event
      ? (event.target as HTMLInputElement)?.value.toUpperCase()
      : '';

    this.filteredUserList = [];
    this.userList.forEach((data: user) => {
      if (
        data.firstName.toUpperCase().includes(filterValue) ||
        data.lastName.toUpperCase().includes(filterValue) ||
        data.login.toUpperCase().includes(filterValue)
      ) {
        this.filteredUserList.push(data);
      }
    });
  }
}
