import { Component } from '@angular/core';
import { TRISTATECHECKBOX_VALUE_ACCESSOR } from 'primeng/tristatecheckbox';
import { TypeEnum } from 'src/app/shared/enums/type.model';
import { labelType } from 'src/app/shared/interfaces/labelType.interface';
import { project } from 'src/app/shared/interfaces/projet.interface';
import { ressource } from 'src/app/shared/interfaces/ressource.interface';
import { user } from 'src/app/shared/interfaces/utilisateur.interface';
import { ApiService } from 'src/app/shared/services/api.service';

const typeList: labelType[] = [
  { label: 'Utilisateur', type: TypeEnum.User },
  { label: 'Projet', type: TypeEnum.Project },
  { label: 'Ressource', type: TypeEnum.Ressource },
];

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent {
  public firstDropdownTypeOption: labelType[] = typeList;
  public firstDropdownTypeSelection!: TypeEnum;

  public firstDropdownElementOption:
    | ressource[]
    | user[]
    | project[]
    | undefined;
  public labelName: string | undefined;
  public labelValue: string | undefined;
  public firstDropdownElementSelection: string | number | undefined;

  public secondDropdownTypeOption: labelType[] | undefined;
  public secondDropdownTypeSelection: TypeEnum | undefined;

  public data!: any;

  public set date(value: string) {
    this._date = value;
  }

  public dateToShow!: string;

  public get date(): string {
    return this._date;
  }

  private _date!: string;

  public error: string = '';

  constructor(private readonly apiService: ApiService) {}

  public onFirstTypeChange() {
    this.secondDropdownTypeSelection = undefined;
    this.firstDropdownElementSelection = undefined;

    if (this.firstDropdownTypeSelection) {
      this.secondDropdownTypeOption = typeList.filter((e) => {
        return e.type !== this.firstDropdownTypeSelection;
      });

      switch (this.firstDropdownTypeSelection) {
        case TypeEnum.Project:
          this.apiService.getAllProject().subscribe((e) => {
            console.log(e);

            this.firstDropdownElementOption = e;
          });
          this.labelName = 'label';
          this.labelValue = 'id';
          break;
        case TypeEnum.Ressource:
          this.apiService.getAllRessources().subscribe((e) => {
            this.firstDropdownElementOption = e;
          });
          this.labelName = 'label';
          this.labelValue = 'id';

          break;
        case TypeEnum.User:
          this.apiService.getAllUser().subscribe((e) => {
            console.log(e);

            this.firstDropdownElementOption = e;
          });
          this.labelName = 'login';
          this.labelValue = 'login';
          break;
        default:
          break;
      }
    } else {
      this.secondDropdownTypeOption = undefined;
    }
  }

  public getDataTable(): void {
    this.error = '';
    if (
      this.date &&
      this.firstDropdownElementSelection &&
      this.secondDropdownTypeSelection &&
      this.firstDropdownTypeSelection
    ) {
      var todayDate = new Date();
      this.dateToShow = this._date;

      var month = Number(this.date.slice(0, 2));
      var year = Number(this.date.slice(3, 9));

      if (!/[0-9]{2}-[0-9]{4}/g.test(this.date)) {
        this.error = 'Format de date non valide';
        return;
      }
      if (month > todayDate.getMonth() + 1 || year > todayDate.getFullYear()) {
        this.error = 'Date invalide';
        return;
      }

      this.apiService
        .getTableData(
          this.firstDropdownTypeSelection,
          this.firstDropdownElementSelection,
          this.secondDropdownTypeSelection,
          month,
          year
        )
        .subscribe((data) => {
          this.data = data.result.filter(
            (e: any) => Number(e.duration_in_hours) !== 0
          );
          if (this.data.length === 0) {
            this.error = 'Aucune donnée';
          }
        });
    }

    // if (this.date) {
    //   if (
    //     this.ressourceNumber &&
    //     this.date &&

    //   ) {
    //     this.error = '';
    //     this.loading = true;
    //     this.apiService
    //       .getTableData(this.ressourceNumber, this.date)
    //       .subscribe((data) => {
    //         this.loading = false;
    //         if (data.status === 'success') {
    //           if (data.result.length > 0) {
    //             this.sessions = data.result;
    //             for (let indexA = 0; indexA < this.sessions.length; indexA++) {
    //               for (
    //                 let indexB = 0;
    //                 indexB < this.sessions[indexA].workingDays.length;
    //                 indexB++
    //               ) {
    //                 if (this.sessions[indexA].workingDays[indexB] !== '') {
    //                   this.sessions[indexA].workingDays[indexB] =
    //                     Math.round(
    //                       this.sessions[indexA].workingDays[indexB] * 100
    //                     ) / 100;
    //                   if (this.sessions[indexA].workingDays[indexB] < 0.05) {
    //                     this.sessions[indexA].workingDays[indexB] = '';
    //                   }
    //                 }
    //               }
    //             }
    //             this.error = '';
    //           } else {
    //             this.error = 'Aucune donnée';
    //             this.sessions = [];
    //           }
    //         }
    //       });
    //   } else if (
    //     Number(this.date.slice(0, 2)) > new Date().getMonth() + 1 ||
    //     Number(this.date.slice(3, 9)) > new Date().getFullYear()
    //   ) {
    //     this.error = 'Date invalide';
    //   } else {
    //     this.sessions = [];
    //     this.error = '';
    //   }
    // }
  }
}
