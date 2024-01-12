import { Component } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {

  //TODO >>> Il faut ajouter une fonction pour
  //fetch les information à enregistrer dans les variables
  // dateHeader et horairesUtilisateurs
  dateHeader: any = [
    {label: "ven", date: "10/01"},
    {label: "sam", date: "11/01"},
    {label: "dim", date: "12/01"},
    {label: "lun", date: "13/01"},
    {label: "mar", date: "14/01"},
    {label: "mer", date: "15/01"},
    {label: "jeu", date: "16/01"},
    {label: "ven", date: "17/01"},
    {label: "sam", date: "18/01"},
    {label: "dim", date: "19/01"},
    {label: "lun", date: "20/01"},
    {label: "mar", date: "21/01"},
    {label: "mer", date: "22/01"},
    {label: "jeu", date: "23/01"}
  ]
  public sessions:any;
  constructor(private readonly apiService: ApiService) {
    this.apiService.getAllSessions().subscribe(data => {
      console.log(data);
        this.sessions = data;
    })
  }
}
