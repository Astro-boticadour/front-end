import { HostListener, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityEnum } from '../enums/activity.model';
import { BehaviorSubject, Observable, takeWhile } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ActivityDialogComponent } from '../components/activity-dialog/activity-dialog.component';
import { user } from '../interfaces/utilisateur.interface';
import { UserInformationService } from './user-information.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private isActivityDefined: boolean;
  private currentActivity!: ActivityEnum;
  private activityObservable!: BehaviorSubject<ActivityEnum>;

  private userConnected!: user;

  ref: DynamicDialogRef | undefined;

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private readonly userInformationService: UserInformationService
  ) {
    this.isActivityDefined = false;

    this.currentActivity = ActivityEnum.Viewer;
    this.activityObservable = new BehaviorSubject<ActivityEnum>(
      ActivityEnum.Viewer
    );
    console.log('fdddrefff');

    this.router.events
      .pipe(takeWhile(() => !this.isActivityDefined))
      .subscribe(() => {
        console.log('frefff');

        if (this.router.url.split('/')[1]) {
          switch (this.router.url.split('/')[1]) {
            case 'user':
              this.activityObservable.next(ActivityEnum.User);
              this.currentActivity = ActivityEnum.User;
              if (this.router.url.split('/')[2]) {
                console.log('rrrrrre');

                this.userInformationService.fetchUserInformation(
                  this.router.url.split('/')[2]
                );
              }
              break;

            case 'administration':
              this.activityObservable.next(ActivityEnum.Administrator);
              this.currentActivity = ActivityEnum.Administrator;

              break;

            case 'view':
              this.activityObservable.next(ActivityEnum.Viewer);
              this.currentActivity = ActivityEnum.Viewer;
              break;
          }
          this.isActivityDefined = true;
        }
      });
  }

  public getCurrentObservable(): Observable<ActivityEnum> {
    return this.activityObservable.asObservable();
  }

  public getCurrentActivity(): ActivityEnum {
    return this.currentActivity;
  }

  public setActivity(activity: ActivityEnum, user?: user) {
    this.activityObservable.next(activity);
    this.currentActivity = activity;

    switch (activity) {
      case ActivityEnum.User:
        if (user) {
          this.userConnected = user;
          this.router.navigate(['/user/' + user.login]);
          this.userInformationService.setUserInformation(user);
        }
        break;
      case ActivityEnum.Viewer:
        this.router.navigate(['/view']);
        break;
      case ActivityEnum.Administrator:
        this.router.navigate(['/administration']);
        break;
    }
  }

  public showActivityDialog() {
    this.ref = this.dialogService.open(ActivityDialogComponent, {
      header: 'Choisir une activité',
      dismissableMask: true,
    });
  }

  public closeActivityDialog() {
    this.ref?.close();
  }

  public getDialogRef() {
    return this.ref;
  }

  public getCurrentConnectedUser(): user {
    return this.userConnected;
  }
}
