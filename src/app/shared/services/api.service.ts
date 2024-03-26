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
      .post<ApiResult>(this.baseUrl + '/login', {}, httpOptions)
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
    return this._httpClient.get<ApiResult>(this.baseUrl + '/projects').pipe(
      first(),
      map((data: ApiResult) => {
        if (data.status === 'success' && data.result) {
          return data.result.map((data: any) => {
            return {
              id: data.id,
              label: data.name,
              dateStart: data.startDate,
              dateEnd: data.endDate,
              isFinished: data.isClosed,
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
    return this._httpClient
      .get<ApiResult>(this.baseUrl + '/project/' + id)
      .pipe(
        first(),
        map((data: ApiResult) => {
          if (data.status === 'success' && data.result) {
            // Data correct : mapping
            return {
              id: data.result.id,
              label: data.result.name,
              dateStart: data.result.dateStart,
              dateEnd: data.result.dateFin,
              isFinished: data.result.isClosed,
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
    return this._httpClient.get<ApiResult>(this.baseUrl + '/users').pipe(
      first(),
      map((data: ApiResult) => {
        if (data.status === 'success' && data.result) {
          return data.result.map((data: any) => {
            return {
              login: data.login,
              firstName: data.firstName,
              lastName: data.lastName,
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
      .get<ApiResult>(this.baseUrl + '/users/' + login)
      .pipe(
        first(),
        map((data: ApiResult) => {
          if (data.status === 'success' && data.result) {
            // Data correct : mapping
            return {
              login: data.result.login,
              firstName: data.result.firstName,
              lastName: data.result.lastName,
              pole: data.result.pole,
            } as user;
          } else {
            throw new Error(data.message ?? 'UnknownError');
          }
        })
      );
  }

  public getAllRessources(): Observable<ressource[]> {
    return this._httpClient.get<ApiResult>(this.baseUrl + '/ressources').pipe(
      first(),
      map((data: ApiResult) => {
        if (data.status === 'success' && data.result) {
          // Data correct : mapping
          return data.result.map((data: any) => {
            return {
              id: data.id,
              label: data.name,
              type: data.type,
              modele: data.modele,
              isUsed: data.isUsed,
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
      .get<ApiResult>(this.baseUrl + '/sessions/activesession/' + login)
      .pipe(
        first(),
        map((data) => {
          if (data.status === 'success' && data.result) {
            data.result = {
              id: data.result.id,
              timestampStart: new Date(data.result.startTime),
              timestampEnd: data.result.endTime
                ? new Date(data.result.endTime)
                : undefined,
              loginUser: data.result.userLogin,
              idProject: data.result.projectId,
            } as session;
            return data;
          } else if (data.status === 'success' && !data.result) {
            return data;
          } else {
            throw new Error(data.message ?? 'UnknownError');
          }
        })
      );
  }

  public createSession(session: session): Observable<any> {
    let obj = {
      id: session.id,
      startTime:
        [
          session.timestampStart.getFullYear(),

          this.pad(session.timestampStart.getMonth() + 1, 2),
          this.pad(session.timestampStart.getDate(), 2),
        ].join('-') +
        ' ' +
        [
          this.pad(session.timestampStart.getHours() - 1, 2),
          this.pad(session.timestampStart.getMinutes(), 2),
          this.pad(session.timestampStart.getSeconds(), 2),
        ].join(':'),
      endTime: session.timestampEnd
        ? [
            session.timestampEnd?.getFullYear(),

            this.pad(
              (session.timestampEnd ? session.timestampEnd?.getMonth() : 0) + 1,
              2
            ),
            this.pad(session.timestampEnd?.getDate(), 2),
          ].join('-') +
          ' ' +
          [
            this.pad(session.timestampEnd?.getHours() - 1, 2),
            this.pad(session.timestampEnd?.getMinutes(), 2),
            this.pad(session.timestampEnd?.getSeconds(), 2),
          ].join(':')
        : undefined,
      loginUser: session.loginUser,
      idProject: session.idProject,
    };

    return this._httpClient.post(this.baseUrl + '/sessions', obj);
  }

  private pad(num: number | string, size: number): string {
    num = num.toString();
    while (num.length < size) num = '0' + num;
    return num;
  }

  public updateSession(session: {
    timestampStart?: Date;
    timestampEnd?: Date;
    loginUser?: string;
    idProject: number;
  }): Observable<any> {
    let obj: {
      startTime?: string;
      endTime?: string;
      loginUser?: string;
      idProject?: number;
    } = {};

    if (session.timestampEnd) {
      obj.endTime =
        [
          session.timestampEnd?.getFullYear(),
          this.pad(
            (session.timestampEnd ? session.timestampEnd?.getMonth() : 0) + 1,
            2
          ),
          this.pad(session.timestampEnd?.getDate(), 2),
        ].join('-') +
        ' ' +
        [
          this.pad(session.timestampEnd?.getHours() - 1, 2),
          this.pad(session.timestampEnd?.getMinutes(), 2),
          this.pad(session.timestampEnd?.getSeconds(), 2),
        ].join(':');
    }
    if (session.loginUser) {
      obj.loginUser = session.loginUser;
    }

    return this._httpClient.patch<any>(
      this.baseUrl + '/sessions/' + session.idProject,
      obj
    );
  }

  public addRessourceToSession(
    idRessource: number,
    idSession: number,
    timestampStart: Date = new Date()
  ): Observable<any> {
    return this._httpClient.post(this.baseUrl + '/utilisations', {
      ressourceId: idRessource,
      sessionId: idSession,
      usageStartDate:
        [
          timestampStart.getFullYear(),

          this.pad(timestampStart.getMonth() + 1, 2),
          this.pad(timestampStart.getDate(), 2),
        ].join('-') +
        ' ' +
        [
          this.pad(timestampStart.getHours() - 1, 2),
          this.pad(timestampStart.getMinutes(), 2),
          this.pad(timestampStart.getSeconds(), 2),
        ].join(':'),
    });
  }

  public removeRessourceToSession(
    idUsage: number,
    timestampEnd: Date = new Date()
  ): Observable<any> {
    return this._httpClient.patch(this.baseUrl + '/utilisations/' + idUsage, {
      usageEndDate:
        [
          timestampEnd.getFullYear(),

          this.pad(timestampEnd.getMonth() + 1, 2),
          this.pad(timestampEnd.getDate(), 2),
        ].join('-') +
        ' ' +
        [
          this.pad(timestampEnd.getHours() - 1, 2),
          this.pad(timestampEnd.getMinutes(), 2),
          this.pad(timestampEnd.getSeconds(), 2),
        ].join(':'),
    });
  }

  public getAllUsageOfSession(id: number): Observable<used[]> {
    return this._httpClient
      .get<ApiResult>(this.baseUrl + '/utilisations/usage/' + id)
      .pipe(
        first(),
        map((data: ApiResult) => {
          if (data.status === 'success' && data.result) {
            return data.result.map((data: any) => {
              return {
                id: data.id,
                idRessource: data.ressourceId,
                idSession: data.sessionId,
                timestampStart: data.usageStartDate,
                timestampEnd: data.usageEndDate,
              } as used;
            });
          } else {
            throw new Error(data.message ?? 'UnknownError');
          }
        })
      );
  }

  public getAllSessions(): Observable<session[]> {
    return this._httpClient.get<ApiResult>(this.baseUrl + '/sessions').pipe(
      first(),
      map((data: ApiResult) => {
        if (data.status === 'success' && data.result) {
          return data.result.map((data: any) => {
            return {
              id: data.id,
              timestampStart: data.startTime,
              timestampEnd: data.endTime,
              loginUser: data.userLogin,
              idProject: data.projectId,
            } as session;
          });
        } else {
          throw new Error(data.message ?? 'UnknownError');
        }
      })
    );
  }

  public getSessionById(id: string): Observable<session[]> {
    return this._httpClient
      .get<ApiResult>(this.baseUrl + '/sessions/' + id)
      .pipe(
        first(),
        map((data: ApiResult) => {
          if (data.status === 'success' && data.result) {
            return data.result.map((data: any) => {
              return {
                id: data.id,
                timestampStart: data.startTime,
                timestampEnd: data.endTime,
                loginUser: data.userLogin,
                idProject: data.projectId,
              } as session;
            });
          } else {
            throw new Error(data.message ?? 'UnknownError');
          }
        })
      );
  }

  public getTableData(
    firstObjectType: string,
    firstFieldId: string | number,
    secondaryObjectType: string,
    month: number,
    year: number
  ): Observable<any> {
    return this._httpClient
      .get<ApiResult>(this.baseUrl + '/data', {
        params: {
          firstObjectType: firstObjectType,
          firstFieldId: firstFieldId,
          secondaryObjectType: secondaryObjectType,
          month: month,
          year: year,
        },
      })
      .pipe(first());
  }

  public createProject(projet: project): Observable<any> {
    var headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    });

    const convertedDateDeb = [
      projet.dateStart.getFullYear(),

      this.pad(projet.dateStart.getMonth() + 1, 2),
      this.pad(projet.dateStart.getDate(), 2),
    ].join('-');

    const convertedDateFin = [
      projet.dateEnd.getFullYear(),

      this.pad(projet.dateEnd.getMonth() + 1, 2),
      this.pad(projet.dateEnd.getDate(), 2),
    ].join('-');

    const httpOptions = {
      headers: headers_object,
    };
    return this._httpClient.post(
      this.baseUrl + '/projects',
      {
        name: projet.label,
        startDate: convertedDateDeb,
        endDate: convertedDateFin,
        description: projet.description,
      },
      httpOptions
    );
  }

  public deleteProject(id: number) {
    var headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    });

    const httpOptions = {
      headers: headers_object,
    };
    return this._httpClient.delete<{ result: { id: number }; status: string }>(
      this.baseUrl + '/projects/' + id + '/',
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
      this.baseUrl + '/ressources',
      {
        name: ressource.label,
        type: ressource.type,
        model: ressource.modele,
      },
      httpOptions
    );
  }

  public deleteRessource(id: number) {
    var headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    });

    const httpOptions = {
      headers: headers_object,
    };
    return this._httpClient.delete<{ result: { id: number }; status: string }>(
      this.baseUrl + '/ressources/' + id + '/',
      httpOptions
    );
  }

  // USER
  public createUser(utilisateur: user): Observable<any> {
    var headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    });

    const httpOptions = {
      headers: headers_object,
    };
    return this._httpClient.post(
      this.baseUrl + '/users',
      {
        login: utilisateur.login,
        firstName: utilisateur.firstName,
        lastName: utilisateur.lastName,
        pole: utilisateur.pole,
      },
      httpOptions
    );
  }

  public deleteUser(login: String) {
    var headers_object = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.token,
    });

    const httpOptions = {
      headers: headers_object,
    };
    return this._httpClient.delete<{
      result: { login: String };
      status: String;
    }>(this.baseUrl + '/users/' + login + '/', httpOptions);
  }
}
