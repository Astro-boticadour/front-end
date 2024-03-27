import { user } from 'src/app/shared/interfaces/utilisateur.interface';
import { ActivityService } from 'src/app/shared/services/activity.service';
import { Component } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';

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
    //this.tableData.forEach((e: user) => {e.editing = false})
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

  public delete(u : user) {
    if (confirm("Souhaitez-vous supprimer l'utilisateur " + u.login + " ? Cette action est irréversible.")) {
      this.apiService.deleteUser(u.login)
        .subscribe((data) => {
          this.getTableData();
          if (data.status === 'success') {
            alert('Utilisateur ' + u.login + ' supprimée');
          } else {
            alert('erreur');
          }
        });
    }

    return 0;
  }

  public edit(u: user) {
    this.userTemp = { login: u.login, firstName: u.firstName, lastName: u.lastName, pole: u.pole };
    u.editing = true;
  }

  public saveEdit(u: user) {
    if (!(u.login && u.firstName && u.lastName && u.pole)) {
      alert("veuillez remplir tous les champs avant de modifier un utilisateur");
      return 0;
    }

    if (u.firstName === this.userTemp.firstName && u.lastName === this.userTemp.lastName && u.pole === this.userTemp.pole)
    {
      u.editing = false;
      return 0;
    }
    this.apiService.majUser(u)
      .subscribe((data) => {
        this.getTableData();
        if (data.status === 'success') {
          alert('Utilisateur modifié');
          u.editing = false;
        } else {
          alert('erreur');
        }
      });
    return 1
    
  }

  public cancelEdit(u: user) {
    u.firstName = this.userTemp.firstName;
    u.lastName = this.userTemp.lastName;
    u.pole = this.userTemp.pole;
    u.editing = false;
  }
}
