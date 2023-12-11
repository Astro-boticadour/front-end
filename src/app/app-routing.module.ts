import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { LoginComponent } from './login/login.component'; // Importe ton composant de login

const routes: Routes = [
  // { path: 'login', component: LoginComponent }, // Route pour le login sans guard
  // Définis toutes les autres routes avec le guard
  { path: '', children: [
    // Tes autres routes ici...
    // { path: 'dashboard', component: DashboardComponent },
    // { path: 'profile', component: ProfileComponent },
    // ...
    // Ajoute d'autres routes qui nécessitent l'authentification ici
  ]},
  // Tu peux ajouter une route par défaut pour rediriger vers la page de connexion si nécessaire
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
