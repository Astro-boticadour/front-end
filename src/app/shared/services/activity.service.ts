import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityEnum } from '../enums/activity.model'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  currentRole!: ActivityEnum;
  currentRoleObservable!: Observable<ActivityEnum>;
  router: Router;

  constructor(private rt: Router) {
    this.router = rt

    if (!this.currentRole && this.router.url.split("/")[1]) {
     switch (this.router.url.split("/")[1]) {
      case "user":

        break;

      case "administration":

        break;

      case "view":

        break;
     }
    }
  }

  getCurrentActivity() {
    return this.currentRole
  }

  setActivity(activity: ActivityEnum) {
    this.currentRole = activity
  }
}
