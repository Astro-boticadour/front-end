import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, first, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { project } from '../interfaces/projet.interface';
import { user } from '../interfaces/utilisateur.interface';
import { ApiResult } from '../interfaces/api-result.interface';
import { session } from '../interfaces/session.interface';
import { ressource } from '../interfaces/ressource.interface';
import { used } from '../interfaces/utilise.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public baseUrl: string;

  private token!: string;

  constructor(private _httpClient: HttpClient) {
    this.baseUrl = environment.API_URL;
  }

  // ADMIN

  public removeToken(): void {
    this.removeToken === undefined;
  }

  public isTokenDefined(): boolean {
    return this.token !== undefined;
  }

  public requestToken(login: string, password: string): Observable<boolean> {
    var headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(login + ':' + password),
    });

    const httpOptions = {
      headers: headers_object,
    };
    return this._httpClient
      .post<ApiResult>(this.baseUrl + '/admin/login', {}, httpOptions)
      .pipe(
        first(),
        map((data: ApiResult) => {
          if (data.status === 'success') {
            this.token = data.result.token;
            return true;
          }
          return false;
        })
      );
  }

  // PROJECT

  public getAllProject(): Observable<project[]> {
    return this._httpClient.get<ApiResult>(this.baseUrl + '/projet').pipe(
      first(),
      map((data: ApiResult) => {
        if (data.status === 'success' && data.result) {
          return data.result.map((data: any) => {
            return {
              id: data.id,
              label: data.nom,
              dateStart: data.dateDebut,
              dateEnd: data.dateFin,
              isFinished: data.estClos,
              description: data.description ? data.description : undefined,
            } as project;
          });
        } else {
          throw new Error(data.message ?? 'UnknownError');
        }
      })
    );
  }

  public getProjectById(id: number): Observable<project> {
    return this._httpClient.get<ApiResult>(this.baseUrl + '/projet/' + id).pipe(
      first(),
      map((data: ApiResult) => {
        if (data.status === 'success' && data.result) {
          // Data correct : mapping
          return {
            id: data.result.id,
            label: data.result.nom,
            dateStart: data.result.dateDebut,
            dateEnd: data.result.dateFin,
            isFinished: data.result.estClos,
            description: data.result.description
              ? data.result.description
              : undefined,
          } as project;
        } else {
          throw new Error(data.message ?? 'UnknownError');
        }
      })
    );
  }

  // USER

  public getAllUser(): Observable<user[]> {
    return this._httpClient.get<ApiResult>(this.baseUrl + '/utilisateur').pipe(
      first(),
      map((data: ApiResult) => {
        if (data.status === 'success' && data.result) {
          return data.result.map((data: any) => {
            return {
              login: data.login,
              firstName: data.prenom,
              lastName: data.nom,
              pole: data.pole,
            } as user;
          });
        } else {
          throw new Error(data.message ?? 'UnknownError');
        }
      })
    );
  }

  public getUserByLogin(login: string): Observable<user> {
    return this._httpClient
      .get<ApiResult>(this.baseUrl + '/utilisateur/' + login)
      .pipe(
        first(),
        map((data: ApiResult) => {
          if (data.status === 'success' && data.result) {
            // Data correct : mapping
            return {
              login: data.result.login,
              firstName: data.result.prenom,
              lastName: data.result.nom,
              pole: data.result.pole,
            } as user;
          } else {
            throw new Error(data.message ?? 'UnknownError');
          }
        })
      );
  }

  public getAllRessources(): Observable<ressource[]> {
    return this._httpClient.get<ApiResult>(this.baseUrl + '/ressource').pipe(
      first(),
      map((data: ApiResult) => {
        if (data.status === 'success' && data.result) {
          // Data correct : mapping
          return data.result.map((data: any) => {
            return {
              id: data.id,
              label: data.nom,
              type: data.type,
              modele: data.modele,
              isUsed: data.estUtilise,
            } as ressource;
          });
        } else {
          throw new Error(data.message ?? 'UnknownError');
        }
      })
    );
  }

  public getSessionFromUser(login: string): Observable<any> {
    return this._httpClient
      .get<ApiResult>(this.baseUrl + '/session/activesessions/' + login)
      .pipe(
        first(),
        map((data) => {
          if (data.status === 'success' && data.result.working) {
            data.result.session = {
              id: data.result.session.id,
              timestampStart: data.result.session.horodatageDebut,
              timestampEnd: data.result.session.horodatageFin,
              loginUser: data.result.session.loginUtilisateur,
              idProject: data.result.session.idProjet,
            } as session;
            return data;
          } else if (data.status === 'success' && !data.result.working) {
            return data;
          } else {
            throw new Error(data.message ?? 'UnknownError');
          }
        })
      );
  }

  public createSession(session: session): Observable<any> {
    return this._httpClient.post(this.baseUrl + '/session', {
      id: session.id,
      horodatageDebut: session.timestampStart,
      horodatageFin: session.timestampEnd,
      loginUtilisateur: session.loginUser,
      idProjet: session.idProject,
    });
  }

  public updateSession(session: session): Observable<any> {
    return this._httpClient.put<any>(this.baseUrl + '/session/' + session.id, {
      horodatageDebut: session.timestampStart,
      horodatageFin: session.timestampEnd,
      loginUtilisateur: session.loginUser,
      idProjet: session.idProject,
    });
  }

  public addRessourceToSession(
    idRessource: number,
    idSession: number,
    timestampStart: number = Math.round(new Date().getTime() / 1000)
  ): Observable<any> {
    return this._httpClient.post(this.baseUrl + '/utilise', {
      idRessource: idRessource,
      idSession: idSession,
      horodatageDebutUtilisation: timestampStart,
    });
  }

  public removeRessourceToSession(
    idUsage: number,
    timestampEnd: number = Math.round(new Date().getTime() / 1000)
  ): Observable<any> {
    return this._httpClient.put(this.baseUrl + '/utilise/' + idUsage, {
      horodatageFinUtilisation: timestampEnd,
    });
  }

  public getAllUsageOfSession(id: number): Observable<used[]> {
    return this._httpClient
      .get<ApiResult>(this.baseUrl + '/session/usage/' + id)
      .pipe(
        first(),
        map((data: ApiResult) => {
          if (data.status === 'success' && data.result) {
            return data.result.map((data: any) => {
              return {
                id: data.id,
                idRessource: data.idRessource,
                idSession: data.idSession,
                timestampStart: data.horodatageDebutUtilisation,
                timestampEnd: data.horodatageFinUtilisation,
              } as used;
            });
          } else {
            throw new Error(data.message ?? 'UnknownError');
          }
        })
      );
  }

  public getAllSessions(): Observable<session[]> {
    return this._httpClient.get<ApiResult>(this.baseUrl + '/session').pipe(
      first(),
      map((data: ApiResult) => {
        if (data.status === 'success' && data.result) {
          return data.result.map((data: any) => {
            return {
              id: data.id,
              timestampStart: data.horodatageDebut,
              timestampEnd: data.horodatageFin,
              loginUser: data.loginUtilisateur,
              idProject: data.idProjet,
            } as session;
          });
        } else {
          throw new Error(data.message ?? 'UnknownError');
        }
      })
    );
  }

  public getSessionById(id: string): Observable<session[]> {
    return this._httpClient.get<ApiResult>(this.baseUrl + '/session' + id).pipe(
      first(),
      map((data: ApiResult) => {
        if (data.status === 'success' && data.result) {
          return data.result.map((data: any) => {
            return {
              id: data.id,
              timestampStart: data.timestampStart,
              timestampEnd: data.timestampEnd,
              loginUser: data.loginUser,
              idProject: data.idProject,
            } as session;
          });
        } else {
          throw new Error(data.message ?? 'UnknownError');
        }
      })
    );
  }

  public getTableData(idRessource: number, month: string): Observable<any> {
    return this._httpClient
      .get<ApiResult>(this.baseUrl + '/data/get_ressource_timesheet', {
        params: { idRessource: idRessource, month: month },
      })
      .pipe(first());
  }

  public createProject(projet: project): Observable<any> {
    var headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    });

    const httpOptions = {
      headers: headers_object,
    };
    return this._httpClient.post(
      this.baseUrl + '/projet',
      {
        nom: projet.label,
        dateDebut: projet.dateStart,
        dateFin: projet.dateEnd,
        estClos: projet.isFinished,
        description: projet.description,
      },
      httpOptions
    );
  }
  public createRessource(ressource: ressource): Observable<any> {
    var headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    });

    const httpOptions = {
      headers: headers_object,
    };
    return this._httpClient.post(
      this.baseUrl + '/ressource',
      {
        nom: ressource.label,
        type: ressource.type,
        modele: ressource.modele,
      },
      httpOptions
    );
  }
}
