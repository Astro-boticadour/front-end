import { Component } from '@angular/core';
import { project } from 'src/app/shared/interfaces/projet.interface';
import { ApiService } from 'src/app/shared/services/api.service';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  tableData!: project[];
  inputValue!: string;

  label!: string;
  dateStart!: Date;
  dateEnd!: Date;
  isFinished!: boolean;
  description!: string;

  constructor(private apiService: ApiService) {
    this.getTableData();
  }

  public getTableData(): void {
    this.apiService.getAllProject().subscribe((data) => {
      this.tableData = data;
    });
  }

  public create() {
    if (!(this.label && this.dateStart && this.dateEnd && this.description)) {
      alert('veuillez remplir tous les champs avant de créer un projet');
      return 0;
    }
    this.apiService
      .createProject({
        label: this.label,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        isFinished: this.isFinished,
        description: this.description,
      })
      .subscribe((data) => {
        this.getTableData();
        if (data.status === 'success') {
          alert('projet créé');
        } else {
          alert('erreur');
        }
      });
    return 1;
  }
}
