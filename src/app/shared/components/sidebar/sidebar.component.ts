import { Component, HostListener } from '@angular/core';
import { ActivityService } from '../../services/activity.service';
import { Observable } from 'rxjs';
import { ActivityEnum } from '../../enums/activity.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  public mobileDesign: boolean;
  public showRoleChangement: boolean = false;
  public displayMenu: boolean = false;
  public activityObservable: Observable<ActivityEnum>;
  public ActivityEnum = ActivityEnum // makes ActivityEnum enum available in the template

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth < 750) {
      this.mobileDesign = true
    } else {
      this.mobileDesign = false
    }  }

  constructor(private activityService: ActivityService) {
    this.activityObservable = this.activityService.getCurrentObservable()

    if (window.innerWidth < 750) {
      this.mobileDesign = true
    } else {
      this.mobileDesign = false
    }
  }

  public toggleMenu(): void {
    /* ALTERNATIVE
    if (this.activityService.getCurrentActivity() !== ActivityEnum.User) {
    this.displayMenu = !this.displayMenu
    } else {
      this.activityService.showActivityDialog()
    }
    */
    this.displayMenu = !this.displayMenu
  }

  public toggleActivitySelection(): void {
    this.activityService.showActivityDialog()
  }

  public closeDialogIfMobile(): void {
    if (this.mobileDesign) this.toggleMenu()
  }
}
