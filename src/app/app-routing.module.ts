import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerComponent } from './pages/viewer/viewer.component';
// import { LoginComponent } from './login/login.component'; // Importe ton composant de login

const routes: Routes = [
  {
    path: 'administration',
    children: [{ path: 'projects', component: ViewerComponent}, { path: 'ressources', component: ViewerComponent}, { path: 'users', component: ViewerComponent}],
  },
  { path: 'view', component: ViewerComponent},
  { path: 'user/:name', children: [{ path: '', component: ViewerComponent}] },
  { path: '**', redirectTo:'view'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
