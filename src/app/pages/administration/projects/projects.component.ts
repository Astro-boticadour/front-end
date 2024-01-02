import { Component } from '@angular/core';
import { project } from 'src/app/shared/interfaces/projet.interface';
import { ApiService } from 'src/app/shared/services/api.service';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
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
    this.getTableData()
  }

  public getTableData(): void {
    this.apiService.getAllProject().pipe(takeWhile(() => this.tableData === undefined)).subscribe((data) => {this.tableData = data})
  }

  public create() {
    if (this.label, this.dateStart, this.dateEnd, this.isFinished) {

    }
  }
}
