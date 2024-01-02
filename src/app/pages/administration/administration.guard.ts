import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

export const administrationGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).isUserLoggedIn;
};
