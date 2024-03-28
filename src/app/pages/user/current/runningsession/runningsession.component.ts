import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { ressource } from 'src/app/shared/interfaces/ressource.interface';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-runningsession',
  templateUrl: './runningsession.component.html',
  styleUrl: './runningsession.component.scss',
})
export class RunningsessionComponent {
  public shownOptions: ressource[] = [];

  @Input() set ressourcesList(value: ressource[]) {
    this._ressourcesList = value;
    this.calculateShownOption();
  }
  private _ressourcesList!: ressource[];

  public _selectedRessource: number[] = [];

  public sessionTimeUnite!: string;

  public shownSessionTime!: number;

  private literalTimestamp!: number;

  @Input() set timeSession(value: number) {
    this.literalTimestamp = value / 1000;
    if (this.literalTimestamp < 3600) {
      this.shownSessionTime = Math.round(this.literalTimestamp / 60);
      this.sessionTimeUnite = 'minute(s)';
    } else {
      this.shownSessionTime = Math.round(this.literalTimestamp / 3600);
      this.sessionTimeUnite = 'heure(s)';
    }
  }

  @Input() isDataLoading: boolean = false;

  @Input() set selectedRessource(value: number[]) {
    this._selectedRessource = value;

    this.calculateShownOption();
  }
  @Output() selectedRessourceChange = new EventEmitter<number[]>();

  @Input() ressourcesUsedIdList: any = [];

  @Output() closeSessionEvent = new EventEmitter<undefined>();

  @Output() updateSessionEvent = new EventEmitter<number[]>();

  constructor(private readonly apiService: ApiService) {
    interval(5000).subscribe(() => {
      if (this.literalTimestamp) {
        this.literalTimestamp += 5;

        if (this.literalTimestamp < 3600) {
          this.shownSessionTime = Math.round(this.literalTimestamp / 60);
          this.sessionTimeUnite = 'minute(s)';
        } else {
          this.shownSessionTime = Math.round(this.literalTimestamp / 3600);
          this.sessionTimeUnite = 'heure(s)';
        }
      }
    });
  }

  updateRessources() {
    this.updateSessionEvent.emit(this._selectedRessource);
  }

  closeSession() {
    this.closeSessionEvent.emit();
  }

  calculateShownOption() {
    if (this._ressourcesList) {
      this.shownOptions = this._ressourcesList;
      this.shownOptions.forEach((data: ressource) => {
        if (data.id) {
          if (
            data.isUsed === true &&
            !this._selectedRessource.includes(data.id)
          ) {
            data.disabled = true;
          } else {
            data.disabled = false;
          }
        }
      });
      /* this.shownOptions = this.ressourcesList.filter(
      (data) => data.isUsed === 0 ||
    );*/
    }
  }
}
