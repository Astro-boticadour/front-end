import { Component } from '@angular/core';
import { SessionStatusEnum } from 'src/app/shared/enums/session-status.model';
import { ressource } from 'src/app/shared/interfaces/ressource.interface';
import { session } from 'src/app/shared/interfaces/session.interface';
import { ApiService } from 'src/app/shared/services/api.service';
import { UserInformationService } from 'src/app/shared/services/user-information.service';

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrl: './current.component.scss',
})
export class CurrentComponent {
  public usedRessources!: ressource[];
  public sessionInformation!: session;
  public sessionsStatus: SessionStatusEnum = SessionStatusEnum.Undefined;

  public SessionStatusEnum = SessionStatusEnum;

  constructor(
    private readonly apiService: ApiService,
    private readonly userInformationService: UserInformationService
  ) {
    let userLogin = this.userInformationService.getUserInformation()?.login;
    if (userLogin) {
      this.apiService.getSessionFromUser(userLogin).subscribe((data) => {
        this.sessionInformation = data;
        this.sessionsStatus = SessionStatusEnum.Running;
      });
    }
  }

  createNewSession() {
    this.apiService.createSessionForUser(this.sessionInformation);
    this.sessionsStatus = SessionStatusEnum.Running;
  }

  updateSessionForUser() {
    this.apiService.updateSessionForUser(this.sessionInformation);
  }

  initializingSession() {
    this.sessionsStatus = SessionStatusEnum.Initializing;
  }
}
