import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityEnum } from 'src/app/shared/enums/activity.model';
import { user } from 'src/app/shared/interfaces/utilisateur.interface';
import { ActivityService } from 'src/app/shared/services/activity.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public ActivityEnum = ActivityEnum; // makes ActivityEnum enum available in the template

  public currentActivity$: Observable<ActivityEnum>;

  public userList: user[] = [];
  public filteredUserList: user[] = [];
  public isConnectingAsAdmin: boolean = false;

  public username!: string;
  public password!: string;

  toggleAdminLogin() {
    this.isConnectingAsAdmin = !this.isConnectingAsAdmin;
  }

  public connect() {
    this.authService.login(this.username, this.password).subscribe((data) => {
      if (data) {
        this.activityService.setActivity(ActivityEnum.Administrator);
        this.activityService.closeActivityDialog();
      }
    });
  }

  constructor(
    private activityService: ActivityService,
    private apiService: ApiService,
    private authService: AuthService
  ) {
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
