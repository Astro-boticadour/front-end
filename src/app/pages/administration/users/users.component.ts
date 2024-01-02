import { Component } from '@angular/core';
import { user } from 'src/app/shared/interfaces/utilisateur.interface';
import { ActivityService } from 'src/app/shared/services/activity.service';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  user: user;

  constructor(private activityService: ActivityService) {
    this.user = this.activityService.getCurrentConnectedUser()
  }
}
