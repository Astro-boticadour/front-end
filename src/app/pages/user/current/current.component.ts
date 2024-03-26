import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SessionStatusEnum } from 'src/app/shared/enums/session-status.model';
import { ressource } from 'src/app/shared/interfaces/ressource.interface';
import { session } from 'src/app/shared/interfaces/session.interface';
import { used } from 'src/app/shared/interfaces/utilise.interface';
import { ApiService } from 'src/app/shared/services/api.service';
import { UserInformationService } from 'src/app/shared/services/user-information.service';
import { RunningsessionComponent } from './runningsession/runningsession.component';
import { user } from 'src/app/shared/interfaces/utilisateur.interface';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

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

  public ressourcesList: ressource[] = [];

  @ViewChild('runningSession') runningSessionElement!: RunningsessionComponent;

  constructor(
    private readonly apiService: ApiService,
    private readonly userInformationService: UserInformationService,
    private readonly messageService: MessageService,
    private readonly websocketService: WebsocketService
  ) {
    this.sessionsStatus = SessionStatusEnum.Undefined;
  }

  ngOnInit() {
    this.getAllData();

    this.messageService.add({
      severity: 'success',
      summary: 'Service Message',
      detail: 'Via MessageService',
    });
  }

  getAllData() {
    this.userInformationService
      .getUserInformationObservable()
      .subscribe((dataUser: user | undefined) => {
        if (dataUser) {
          this.apiService
            .getSessionFromUser(dataUser.login)
            .subscribe((dataSession: any) => {
              if (dataSession.result !== null) {
                this.sessionInformation = dataSession.result;
                this.sessionsStatus = SessionStatusEnum.Running;
              } else {
                this.sessionsStatus = SessionStatusEnum.Undefined;
              }
              console.log(this.sessionInformation);
            });

          this.apiService.getAllRessources().subscribe((dataSession: any) => {
            this.ressourcesList = dataSession;
          });

          this.websocketService.connect('sessions');

          this.websocketService
            .listen('sessions')
            .subscribe((dataTempo: { reason: string; data: any }) => {
              const dataSessions = {
                id: dataTempo.data.id,
                idProject: dataTempo.data.projectId,
                timestampStart: dataTempo.data.startTime,
                timestampEnd: dataTempo.data.endTime,
                loginUser: dataTempo.data.userLogin,
              } as session;

              if (dataSessions.loginUser === dataUser.login) {
                if (dataTempo.reason !== 'updated') {
                  this.sessionInformation = dataSessions;
                  this.sessionsStatus = SessionStatusEnum.Running;
                } else {
                  this.sessionsStatus = SessionStatusEnum.Undefined;
                }
              }
            });

          this.websocketService.connect('ressources');

          this.websocketService
            .listen('ressources')
            .subscribe((dataTempo: { reason: string; data: any }) => {
              const dataSessions = {
                id: dataTempo.data.id,
                label: dataTempo.data.name,
                type: dataTempo.data.type,
                modele: dataTempo.data.model,
                isUsed: dataTempo.data.isUsed,
              } as ressource;

              this.apiService.getAllRessources().subscribe((data) => {
                this.ressourcesList = data;
              });
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
                    this.isDataLoading = false;
                  });
              }
            });
        }
      });
    this.dataReceived = true;
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
        timestampStart: new Date(),
        loginUser: login,
      };
      console.log(this.sessionInformation);
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

      this.apiService
        .updateSession({
          idProject: this.sessionInformation.id ?? 0,
          timestampEnd: new Date(),
        })
        .subscribe((x) => {
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
