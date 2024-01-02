import { Component, HostListener } from '@angular/core';
import { ActivityService } from '../../services/activity.service';
import { Observable } from 'rxjs';
import { ActivityEnum } from '../../enums/activity.model';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { user } from '../../interfaces/utilisateur.interface';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-activity-dialog',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ButtonModule,
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

  constructor(
    private activityService: ActivityService,
    private authService: AuthService,
    private apiService: ApiService
  ) {
    this.dialogPart = "activity";
    this.currentActivity$ = this.activityService.getCurrentObservable();

    this.apiService.getAllUser().subscribe(data => this.userList = data)
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
}
