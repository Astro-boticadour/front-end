import { Component } from '@angular/core';
import { project } from 'src/app/shared/interfaces/projet.interface';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-initsession',
  templateUrl: './initsession.component.html',
  styleUrl: './initsession.component.scss',
})
export class InitsessionComponent {
  public projectsList!: project[];
  public selectedProject!: project;

  constructor(private readonly apiService: ApiService) {
    this.apiService.getAllProject().subscribe((data) => {
      this.projectsList = data;
    });
  }
}
