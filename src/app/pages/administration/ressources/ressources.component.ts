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

  ressourceTemp!: ressource;

  constructor(private apiService: ApiService) {
    this.getTableData();

    this.typeRobot = ['robot'];
  }

  public getTableData(): void {
    this.apiService.getAllRessources().subscribe((data) => {
      this.tableData = data;
    });
    //this.tableData.forEach((e: ressource) => {e.editing = false})
  }

  public create() {
    if (!(this.label && this.type && this.modele)) {
      alert('veuillez remplir tous les champs avant de créer une ressource');
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
  
  public delete(r: ressource)
  {
    if(confirm("Souhaitez-vous supprimer la ressource " + r.label +" ?  Cette action est irréversible."))
    {
    this.apiService.deleteRessource(r.id)
    .subscribe((data) => {
      this.getTableData();
      if (data.status === 'success') 
      {
        alert('ressource '+r.label+' supprimée');
      } else {
        alert('erreur');
      }
    });
  }
    return 0;
  }

  public edit(r: ressource)
  {
    this.ressourceTemp = { label: r.label, type: r.type, modele: r.modele, isUsed : r.isUsed};
    r.editing = true;
  }

  public saveEdit(r: ressource)
  {
    if (!(r.label && r.type && r.modele)) {
      alert('veuillez remplir tous les champs avant de modifier une ressource');
      return 0;
    }

    if (r.label === this.ressourceTemp.label && r.type === this.ressourceTemp.type && r.modele === this.ressourceTemp.modele)
    {
      r.editing = false;
      return 0;
    }
    this.apiService
      .majRessource(r)
      .subscribe((data) => {
        this.getTableData();
        if (data.status === 'success') {
          alert('ressource modifié');
          r.editing = false;
        } else {
          alert('erreur');
        }
      });
    return 1;
  }
  
  public cancelEdit(r: ressource)
  {
    r.label = this.ressourceTemp.label;
    r.type = this.ressourceTemp.type;
    r.modele = this.ressourceTemp.modele;
    r.editing = false;
  }
}
