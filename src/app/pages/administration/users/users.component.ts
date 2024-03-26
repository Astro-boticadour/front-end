import { user } from 'src/app/shared/interfaces/utilisateur.interface';
import { ActivityService } from 'src/app/shared/services/activity.service';
import { Component } from '@angular/core';
import { project } from 'src/app/shared/interfaces/projet.interface';
import { ApiService } from 'src/app/shared/services/api.service';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  user: user;
  tableData!: user[];
  inputValue!: string;

  login!: string;
  firstName!: string;
  lastName!: string;
  poles = [
    "Robotique",
    "Composite",
    "Fabrication additive"
  ];
  pole!: string;

  userTemp!: user;


  constructor(private apiService: ApiService, private activityService: ActivityService) {
    this.getTableData();
    this.user = this.activityService.getCurrentConnectedUser();
  }

  public getTableData(): void {
    this.apiService.getAllUser().subscribe((data) => { this.tableData = data })
  }

  public create() {
    if (!(this.login && this.firstName && this.lastName && this.pole)) {
      alert("veuillez remplir tous les champs avant de créer un utilisateur");
      return 0;
    }
    this.apiService.createUser({ login: this.login, firstName: this.firstName, lastName: this.lastName, pole: this.pole })
      .subscribe((data) => {
        alert("Utilisateur créé");
        this.getTableData();
      });
    return 1
  }

  public delete(login: String) {
    if (confirm("Souhaitez-vous supprimer le projet " + login + " ?")) {
      this.apiService.deleteUser(login)
        .subscribe((data) => {
          this.getTableData();
          if (data.status === 'success') {
            alert('Projet ' + login + ' supprimée');
          } else {
            alert('erreur');
          }
        });
    }

    return 0;
  }

  public edit(u: user) {
    u.editing = true;
    this.userTemp = { login: u.login, firstName: u.firstName, lastName: u.lastName, pole: u.pole };
    console.log(this.userTemp);
  }

  public saveEdit(u: user) {
    if (!(u.login && u.firstName && u.lastName && u.pole)) {
      alert("veuillez remplir tous les champs avant de modifier un utilisateur");
      return 0;
    }
    this.apiService.majUser(u)
      .subscribe((data) => {
        this.getTableData();
        if (data.status === 'success') {
          alert('Projet ' + u.login + ' modifié');
        } else {
          alert('erreur');
        }
      });
    return 1
    u.editing = false;
  }

  public cancelEdit(u: user) {
    u.firstName = this.userTemp.firstName;
    u.lastName = this.userTemp.lastName;
    u.pole = this.userTemp.pole;
    u.editing = false;
  }
}
