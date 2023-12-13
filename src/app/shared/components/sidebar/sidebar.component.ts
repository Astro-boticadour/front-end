import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  activity = "administrateur";
  mobileDesign: boolean;
  displayMenu: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 1080) {
      this.mobileDesign = true
    } else {
      this.mobileDesign = false
    }  }

  constructor() {
    if (window.innerWidth < 1080) {
      this.mobileDesign = true
    } else {
      this.mobileDesign = false
    }
  }

  public toggleMenu(): void {
    this.displayMenu = !this.displayMenu
  }
}
