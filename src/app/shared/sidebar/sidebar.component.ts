import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  role = "administrateur";
  mobileDesign: boolean;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;
  }

  constructor() {
    if (window.innerWidth < 340) {
      this.mobileDesign = true
    } else {
      this.mobileDesign = false
    }
  }
}
