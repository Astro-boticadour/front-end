import { Component } from '@angular/core';
import { takeWhile } from 'rxjs';
import { ressource } from 'src/app/shared/interfaces/ressource.interface';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-ressources',
  templateUrl: './ressources.component.html',
  styleUrl: './ressources.component.scss',
})
export class RessourcesComponent {
  tableData!: ressource[];
  inputValue!: string;

  label!: string;
  type!: string;
  modele!: string;

  typeRobot!: string[];

  constructor(private apiService: ApiService) {
    this.getTableData();

    this.typeRobot = ['robot'];
  }

  public getTableData(): void {
    this.apiService.getAllRessources().subscribe((data) => {
      this.tableData = data;
    });
  }

  public create() {
    if (!(this.label && this.type && this.modele)) {
      alert('veuillez remplir tous les champs avant de créer un projet');
      return 0;
    }
    this.apiService
      .createRessource({
        label: this.label,
        type: this.type,
        modele: this.modele,
      } as ressource)
      .subscribe((data) => {
        this.getTableData();
        if (data.status === 'success') {
          alert('ressource créé');
        } else {
          alert('erreur');
        }
      });
    return 1;
  }
}
