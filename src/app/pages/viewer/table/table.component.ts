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
  @Input() date: string | undefined;
  @Input() error: string | undefined;

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
}
