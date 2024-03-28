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

  tableTemp!: project;


  constructor(private apiService: ApiService) {
    this.getTableData();
  }

  public dateToString(date: Date) {
    ((date) ? date.toString(): '')
    return (date) ? date.toString(): ''
  }

  public getTableData(): void {
    this.apiService.getAllProject().subscribe((data) => {
      this.tableData = data;
      this.tableData.forEach((e: project) => {e.editing = false})
    });
  }

  public create() {
    if (!(this.label && this.dateStart && this.description)) {
      alert('veuillez remplir le nom, la date de début et la description avant de créer un projet');
      return 0;
    }

    this.apiService
      .createProject({
        label: this.label,
        dateStart: this.dateStart ?? '',
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

  public delete(p: project)
  {
    if(confirm("Souhaitez-vous supprimer le projet " + p.label +" ? Cette action est irréversible."))
    {
    this.apiService.deleteProject(p.id)
    .subscribe((data) => {
      this.getTableData();
      if (data.status === 'success') 
      {
        alert('Projet '+p.label+' supprimée');
      } else {
        alert('erreur');
      }
    });
  }}

  public format(date: string): string {
    if(date)
    {
      console.log(typeof date)
      return new Date(date).toLocaleDateString("fr"); 
    }
    else
    {
      return '';
    }
  }

  public edit(e: project)
  {
    e.dateStart = new Date(e.dateStart);
    e.dateEnd = new Date(e.dateEnd);
    this.tableTemp = {label: e.label, dateStart: e.dateStart, dateEnd :e.dateEnd, isFinished : e.isFinished, description : e.description};
    e.editing = true;
  }

  public saveEdit(e: project)
  {
    if (!(e.label && e.dateStart && e.description)) {
      alert('veuillez remplir le nom, la date de début et la description avant de modifier un projet');
      return 0;
    }

    if( e.label === this.tableTemp.label && e.dateStart === this.tableTemp.dateStart && e.dateEnd === this.tableTemp.dateEnd && e.isFinished === this.tableTemp.isFinished && e.description === this.tableTemp.description)
    {
      e.editing = false;
      return 0;
    }

    this.apiService
      .majProject(e)
      .subscribe((data) => {
        this.getTableData();
        if (data.status === 'success') {
          alert('projet modifié');
          e.editing = false;
        } else {
          alert('erreur');
        }
      });
    return 1;
  } 
  
  public cancelEdit(e: project)
{
    e.label = this.tableTemp.label;
    e.dateStart = this.tableTemp.dateStart;
    e.dateEnd = this.tableTemp.dateEnd;
    e.isFinished = this.tableTemp.isFinished;
    e.description = this.tableTemp.description;
    e.editing = false;
  }
}
