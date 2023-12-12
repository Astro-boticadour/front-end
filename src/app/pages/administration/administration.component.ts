import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityService } from 'src/app/shared/services/activity.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent {

  constructor(private activity: ActivityService) {
    activity.getd()
  }
}
