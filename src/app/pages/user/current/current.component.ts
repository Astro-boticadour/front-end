import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { interval, last } from 'rxjs';
import { SessionStatusEnum } from 'src/app/shared/enums/session-status.model';
import { ressource } from 'src/app/shared/interfaces/ressource.interface';
import { session } from 'src/app/shared/interfaces/session.interface';
import { used } from 'src/app/shared/interfaces/utilise.interface';
import { ApiService } from 'src/app/shared/services/api.service';
import { UserInformationService } from 'src/app/shared/services/user-information.service';
import { RunningsessionComponent } from './runningsession/runningsession.component';

@Component({
  selector: 'app-current',
  templateUrl: './current.component.html',
  styleUrl: './current.component.scss',
})
export class CurrentComponent implements OnInit {
  public sessionInformation!: session;
  public sessionsStatus: SessionStatusEnum = SessionStatusEnum.Undefined;

  public SessionStatusEnum = SessionStatusEnum;

  public dataReceived: boolean = false;

  public timeSession!: number;

  public ressourcesUsed: any = {};

  public ressourcesUsedId: number[] = [];

  public isDataLoading: boolean = false;

  @ViewChild('runningSession') runningSessionElement!: RunningsessionComponent;

  constructor(
    private readonly apiService: ApiService,
    private readonly userInformationService: UserInformationService,
    private readonly messageService: MessageService
  ) {
    this.sessionsStatus = SessionStatusEnum.Undefined;
  }

  ngOnInit() {
    this.getAllData();
    interval(2000).subscribe(() => {
      this.getAllData();
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Service Message',
      detail: 'Via MessageService',
    });
  }

  getAllData() {
    this.userInformationService
      .getUserInformationObservable()
      .subscribe((data) => {
        if (data) {
          this.apiService.getSessionFromUser(data?.login).subscribe((data) => {
            if (data.result.working) {
              this.sessionInformation = data.result.session;
              this.timeSession =
                Math.round(new Date().getTime() / 1000) -
                this.sessionInformation.timestampStart;
              this.sessionsStatus = SessionStatusEnum.Running;
              if (this.sessionInformation.id) {
                this.apiService
                  .getAllUsageOfSession(this.sessionInformation.id)
                  .subscribe((x) => {
                    this.ressourcesUsedId = [];

                    x.forEach((data) => {
                      this.ressourcesUsed[data.idRessource] = data;
                      this.ressourcesUsedId.push(data.idRessource);
                    });

                    if (this.runningSessionElement) {
                      this.runningSessionElement.calculateShownOption();
                    }
                    this.dataReceived = true;
                  });
              }
            } else {
              this.dataReceived = true;
            }
          });
        }
      });
  }

  updateSessionForUser() {
    this.apiService.updateSession(this.sessionInformation);
  }

  initializingSession() {
    this.sessionsStatus = SessionStatusEnum.Initializing;
  }

  createSession(projectId: number) {
    let login = this.userInformationService.getUserInformation()?.login;
    if (login) {
      this.sessionInformation = {
        idProject: projectId,
        timestampStart: Math.round(new Date().getTime() / 1000),
        loginUser: login,
      };
      this.apiService
        .createSession(this.sessionInformation)
        .subscribe((result) => {
          this.timeSession = 60;

          if (result.status === 'success') {
            this.sessionInformation.id = result.result.id;
            this.sessionsStatus = SessionStatusEnum.Running;
          }
        });
    }
  }

  closeSession() {
    if (this.sessionInformation) {
      this.sessionInformation.timestampEnd = Math.round(
        new Date().getTime() / 1000
      );

      Object.keys(this.ressourcesUsed).forEach((x: string) => {
        if (this.sessionInformation.id) {
          this.apiService
            .removeRessourceToSession(this.ressourcesUsed[x].id)
            .subscribe((result) => {
              if ((result.status = 'success')) {
                delete this.ressourcesUsed[x];
              }
            });
        }
      });

      this.apiService.updateSession(this.sessionInformation).subscribe((x) => {
        try {
          if (x.status === 'success') {
            this.sessionsStatus = SessionStatusEnum.Undefined;
            this.messageService.add({
              severity: 'success',
              summary: 'Fermeture de session réussi',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Fermeture de session échoué',
            });
          }
        } catch (e) {
          this.messageService.add({
            severity: 'error',
            summary: 'Fermeture de session échoué',
          });
        }
      });
    }
  }

  updateRessource(ressources: number[]) {
    this.isDataLoading = true;
    let changeNumber = 0;
    ressources.forEach((x) => {
      if (this.sessionInformation.id) {
        if (!Object.keys(this.ressourcesUsed).includes(x.toString())) {
          changeNumber += 1;
          try {
            this.apiService
              .addRessourceToSession(x, this.sessionInformation.id)
              .subscribe((result) => {
                if ((result.status = 'success')) {
                  this.ressourcesUsed[x] = result.result;
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Ressource ajouté',
                  });
                  changeNumber -= 1;
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: "Echec lors de l'ajout de la ressource",
                  });
                }
                if (changeNumber === 0) {
                  this.isDataLoading = false;
                }
              });
          } catch (e) {
            this.messageService.add({
              severity: 'error',
              summary: 'Echec lors du retrait de la ressource',
            });
          }
        }
      }
    });

    Object.keys(this.ressourcesUsed).forEach((x: string) => {
      if (this.sessionInformation.id) {
        if (!ressources.includes(Number(x))) {
          changeNumber += 1;
          try {
            this.apiService
              .removeRessourceToSession(this.ressourcesUsed[x].id)
              .subscribe((result) => {
                if ((result.status = 'success')) {
                  delete this.ressourcesUsed[x];
                  changeNumber -= 1;
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Ressource retiré',
                  });
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Echec lors du retrait de la ressource',
                  });
                }
                if (changeNumber === 0) {
                  this.isDataLoading = false;
                }
              });
          } catch (e) {
            this.messageService.add({
              severity: 'error',
              summary: 'Echec lors du retrait de la ressource',
            });
          }
        }
      }
    });
    if (changeNumber === 0) {
      this.isDataLoading = false;
    }
  }
}
