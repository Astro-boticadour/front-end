import { CanActivateFn } from '@angular/router';

export const authenticationGuard: CanActivateFn = (route, state) => {

  // Logique de vérification de l'authentification

  
  return true;
};
