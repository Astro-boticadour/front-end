import { Injectable } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly apiService: ApiService) {}

  public isUserLogin(): boolean {
    return this.apiService.isTokenDefined();
  }

  login(userName: string, password: string): Observable<boolean> {
    return this.apiService.requestToken(userName, password);
  }

  logout(): void {
    this.apiService.removeToken();
    localStorage.removeItem('isUserLoggedIn');
  }
}
