import { Injectable } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isUserLoggedIn: boolean = false;

  constructor() {}

  login(userName: string, password: string): Observable<boolean> {
    localStorage.setItem(
      'isUserLoggedIn',
      this.isUserLoggedIn ? 'true' : 'false'
    );

    this.isUserLoggedIn = userName == 'admin' && password == 'admin';
    localStorage.setItem(
      'isUserLoggedIn',
      this.isUserLoggedIn ? 'true' : 'false'
    );

    return of(this.isUserLoggedIn).pipe(delay(100));
  }

  logout(): void {
    this.isUserLoggedIn = false;
    localStorage.removeItem('isUserLoggedIn');
  }
}
