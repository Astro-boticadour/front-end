import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { administrationGuard } from './pages/administration/administration.guard';
import { ProjectsComponent } from './pages/administration/projects/projects.component';
import { RessourcesComponent } from './pages/administration/ressources/ressources.component';
import { UsersComponent } from './pages/administration/users/users.component';
import { GraphComponent } from './pages/viewer/graph/graph.component';
import { TableComponent } from './pages/viewer/table/table.component';
import { CurrentComponent } from './pages/user/current/current.component';
import { HistoryComponent } from './pages/user/history/history.component';
import { HomeComponent } from './pages/home/home.component';
// import { LoginComponent } from './login/login.component'; // Importe ton composant de login

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'administration',
    canActivate: [administrationGuard],
    children: [
      { path: 'projects', component: ProjectsComponent },
      { path: 'ressources', component: RessourcesComponent },
      { path: 'users', component: UsersComponent },
      { path: '**', redirectTo: 'users' },
    ],
  },
  {
    path: 'view',
    children: [
      { path: 'graphique', component: GraphComponent },
      { path: 'table', component: TableComponent },
      { path: '**', redirectTo: 'table' },
    ],
  },
  {
    path: 'user/:user',
    children: [
      { path: 'session', component: CurrentComponent },
      { path: 'history', component: HistoryComponent },
      { path: '**', redirectTo: 'session' },
    ],
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
