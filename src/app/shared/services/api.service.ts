import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { project } from '../interfaces/projet.interface';
import { user } from '../interfaces/utilisateur.interface';

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
    return this._httpClient.get(this.baseUrl + '/api/projet').pipe(
      map((data: any) =>
        data.result.map((data: any) => {
          return {
            id: data.id,
            label: data.nom,
            dateStart: data.dateDebut,
            dateEnd: data.dateFin,
            isFinished: data.estClos,
            description: data.description ? data.description : undefined,
          } as project;
        })
      )
    );
  }

  public getProjectById(id: number): Observable<project> {
    return this._httpClient.get(this.baseUrl + '/api/projet/' + id).pipe(
      map((data: any) => {
        return {
          id: data.id,
          label: data.nom,
          dateStart: data.dateDebut,
          dateEnd: data.dateFin,
          isFinished: data.estClos,
          description: data.description ? data.description : undefined,
        } as project;
      })
    );
  }

  // USER

  public getAllUser(): Observable<user[]> {
    return this._httpClient.get(this.baseUrl + '/api/utilisateur').pipe(
      map((data: any) =>
        data.result.map((data: any) => {
          return {
            login: data.login,
            firstName: data.nom,
            lastName: data.prenom,
            pole: data.pole,
          } as user;
        })
      )
    );
  }
}
