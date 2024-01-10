import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, first, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { project } from '../interfaces/projet.interface';
import { user } from '../interfaces/utilisateur.interface';
import { ApiResult } from '../interfaces/api-result.interface';
import { session } from '../interfaces/session.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public baseUrl: string;

  constructor(private _httpClient: HttpClient) {
    this.baseUrl = environment.API_URL;
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

  public getSessionFromUser(user: string): Observable<session> {
    if (user === 'gtritsch') {
      return of({
        id: 25,
        timestampStart: 1704874536,
        loginUser: 'gtritsch',
        idProject: 4,
      });
    } else {
      throw new Error('UserNotFound');
    }
  }

  public createSessionForUser(session: session): boolean {
    return true;
  }

  public updateSessionForUser(session: session): boolean {
    return true;
  }
}
