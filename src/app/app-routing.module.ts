import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerComponent } from './pages/viewer/viewer.component';
import { UserComponent } from './pages/user/user.component';
// import { LoginComponent } from './login/login.component'; // Importe ton composant de login

const routes: Routes = [
  {
    path: 'administration',
    children: [{ path: 'projects', component: ViewerComponent}, { path: 'ressources', component: ViewerComponent}, { path: 'users', component: ViewerComponent}],
  },
  { path: 'view', component: ViewerComponent},
  { path: 'user', children: [{path:'', component: UserComponent}, { path: ':name', component: ViewerComponent}] },
  { path: '**', redirectTo:'view'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
