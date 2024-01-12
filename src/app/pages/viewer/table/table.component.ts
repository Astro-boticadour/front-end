import { Component } from '@angular/core';
import { ressource } from 'src/app/shared/interfaces/ressource.interface';
import { ApiService } from 'src/app/shared/services/api.service';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  public set date(value: string) {
    this._date = value;
    this.getDataTable();
  }

  public get date(): string {
    return this._date;
  }
  public set ressourceNumber(value: number) {
    this._ressourceNumber = value;
    this.getDataTable();
  }
  public get ressourceNumber(): number {
    return this._ressourceNumber;
  }
  public sessions: any[] = [];

  public error: string = '';
  public loading: boolean = false;

  public ressourceList: ressource[] = [];

  private _date!: string;
  private _ressourceNumber!: number;

  constructor(private readonly apiService: ApiService) {
    this.apiService.getAllRessources().subscribe((data) => {
      this.ressourceList = data;
    });
  }

  public getDataTable() {
    if (
      this.ressourceNumber &&
      this.date &&
      /[0-9]{2}-[0-9]{4}/g.test(this.date) &&
      Number(this.date.slice(0, 2)) <= new Date().getMonth() + 1 &&
      Number(this.date.slice(3, 9)) <= new Date().getFullYear()
    ) {
      this.error = '';
      this.loading = true;
      this.apiService
        .getTableData(this.ressourceNumber, this.date)
        .subscribe((data) => {
          this.loading = false;
          console.log(data);
          if (data.status === 'success') {
            if (data.result.length > 0) {
              this.sessions = data.result;
              this.error = '';
            } else {
              this.error = 'Aucune donnée';
              this.sessions = [];
            }
          }
        });
    } else if (
      Number(this.date.slice(0, 2)) > new Date().getMonth() + 1 ||
      Number(this.date.slice(3, 9)) > new Date().getFullYear()
    ) {
      this.error = 'Date invalide';
    } else {
      this.sessions = [];
      this.error = '';
    }
  }
}
