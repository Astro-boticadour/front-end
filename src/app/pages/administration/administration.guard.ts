import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

export const administrationGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).isUserLogin()) {
    return true;
  } else {
    inject(Router).navigate(['/home']);
    return false;
  }
};
