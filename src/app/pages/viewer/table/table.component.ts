import { Component, Input } from '@angular/core';
import { project } from 'src/app/shared/interfaces/projet.interface';
import { TypeEnum } from 'src/app/shared/enums/type.model';
import { labelType } from 'src/app/shared/interfaces/labelType.interface';
import { ressource } from 'src/app/shared/interfaces/ressource.interface';
import { user } from 'src/app/shared/interfaces/utilisateur.interface';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() set data(value: any) {
    if (value[0]) {
      var month = Number(value[1].slice(0, 2));
      var year = Number(value[1].slice(3, 9));
      this.dataTable = this.formatDataTable(value[0], year, month);
    }
  }
  public dataTable!: string[][];

  public set ressourceNumber(value: number) {
    this._ressourceNumber = value;
  }
  public get ressourceNumber(): number {
    return this._ressourceNumber;
  }
  public sessions: any[] = [];

  public loading: boolean = false;

  public ressourceList: ressource[] = [];

  private _ressourceNumber!: number;

  constructor(private readonly apiService: ApiService) {
    this.apiService.getAllRessources().subscribe((data) => {
      this.ressourceList = data;
    });
  }

  public formatDataTable(data: any, year: number, month: number): string[][] {
    let transformedData = {};

    data.map(
      (e: {
        row_label: string;
        duration_in_hours: string;
        day_of_month: number;
      }) => {
        if (!Object.keys(transformedData).includes(e.row_label)) {
          (transformedData[e.row_label as keyof typeof transformedData] as {
            duration_in_hours: string;
            day_of_month: number;
          }[]) = [] as {
            duration_in_hours: string;
            day_of_month: number;
          }[];
        }

        (
          transformedData[e.row_label as keyof typeof transformedData] as {
            duration_in_hours: string;
            day_of_month: number;
          }[]
        ).push({
          duration_in_hours: e.duration_in_hours,
          day_of_month: e.day_of_month,
        });
      }
    );

    var dataTable: string[][] = [];
    let rowIndex = 0;
    Object.keys(transformedData).forEach((e: string) => {
      let listTempo: string[] = [];
      listTempo[0] = e;

      const getDays = (year: number, month: number) => {
        return new Date(year, month, 0).getDate();
      };

      for (let index = 0; index < getDays(year, month); index++) {
        listTempo.push('');
      }

      (
        transformedData[e as keyof typeof transformedData] as {
          duration_in_hours: string;
          day_of_month: number;
        }[]
      ).forEach(
        (element: { duration_in_hours: string; day_of_month: number }) => {
          listTempo[element.day_of_month + 1] = element.duration_in_hours;
        }
      );
      dataTable.push(listTempo);
      rowIndex++;
    });

    return dataTable;
  }
}
