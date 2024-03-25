import { Component } from '@angular/core';
import { ActivityService } from './shared/services/activity.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private activityService: ActivityService) {}
}
