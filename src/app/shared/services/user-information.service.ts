import { Injectable } from '@angular/core';
import { user } from '../interfaces/utilisateur.interface';
import { session } from '../interfaces/session.interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserInformationService {
  private userInformation!: user;
  private userSessionsHistory!: session[];

  constructor(private readonly ApiService: ApiService) {}

  public isUserDefined(): boolean {
    return this.userInformation !== undefined;
  }

  public getUserInformation(): user | undefined {
    return this.userInformation;
  }

  public getUserHistory(): session[] | undefined {
    return this.userSessionsHistory;
  }

  public setUserInformation(user: user): void {
    this.userInformation = user;
  }

  /**
   * Recupere les informations en base de données pour un utilisateur donné
   *
   * @param userLogin - Le login de l'utilisateur à récuperer
   *
   * @returns Une énumération qui représente la réussite ou l'erreur rencontré
   */
  public fetchUserInformation(userLogin: string): void {
    this.ApiService.getUserByLogin(userLogin).subscribe({
      next: (data: user) => {
        this.userInformation = data;
      },
      error: (error: Error) => {
        console.log(error);
      },
    });
  }
}
