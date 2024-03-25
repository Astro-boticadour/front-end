import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { administrationGuard } from './pages/administration/administration.guard';
import { CurrentComponent } from './pages/user/current/current.component';
import { HomeComponent } from './pages/home/home.component';
import { ViewerComponent } from './pages/viewer/viewer.component';
import { AdministrationComponent } from './pages/administration/administration.component';
// import { LoginComponent } from './login/login.component'; // Importe ton composant de login

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'administration',
    canActivate: [administrationGuard],
    component: AdministrationComponent,
  },
  {
    path: 'view',
    component: ViewerComponent,
  },
  {
    path: 'user/:user',
    component: CurrentComponent,
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
