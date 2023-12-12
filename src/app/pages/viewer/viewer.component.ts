import { Component } from '@angular/core';
import { ActivityService } from 'src/app/shared/services/activity.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent {
constructor(private activity: ActivityService) {

}
}
