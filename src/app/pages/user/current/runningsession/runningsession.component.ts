import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ressource } from 'src/app/shared/interfaces/ressource.interface';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-runningsession',
  templateUrl: './runningsession.component.html',
  styleUrl: './runningsession.component.scss',
})
export class RunningsessionComponent {
  public shownOptions: ressource[] = [];

  public ressourcesList: ressource[] = [];

  public _selectedRessource: number[] = [];

  public sessionTimeUnite!: string;

  public shownSessionTime!: number;

  @Input() set timeSession(value: number) {
    if (value < 3600) {
      this.shownSessionTime = Math.round(value / 60);
      this.sessionTimeUnite = 'minute(s)';
    } else {
      this.shownSessionTime = Math.round(value / 3600);
      this.sessionTimeUnite = 'heure(s)';
    }
  }

  @Input() set selectedRessource(value: number[]) {
    this._selectedRessource = value;

    this.calculateShownOption();
  }
  @Output() selectedRessourceChange = new EventEmitter<number[]>();

  @Input() ressourcesUsedIdList: any = [];

  @Output() closeSessionEvent = new EventEmitter<undefined>();

  @Output() updateSessionEvent = new EventEmitter<number[]>();

  constructor(private readonly apiService: ApiService) {
    this.apiService.getAllRessources().subscribe((data) => {
      this.ressourcesList = data;
      this.calculateShownOption();
    });
  }

  updateRessources() {
    this.updateSessionEvent.emit(this._selectedRessource);
  }

  closeSession() {
    this.closeSessionEvent.emit();
  }

  calculateShownOption() {
    this.shownOptions = this.ressourcesList.filter(
      (data) => data.isUsed === 0 || this._selectedRessource.includes(data.id)
    );
  }
}
