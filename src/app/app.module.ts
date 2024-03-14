import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { AdministrationModule } from './pages/administration/administration.module';
import { ViewerModule } from './pages/viewer/viewer.module';
import { UserModule } from './pages/user/user.module';
import { TopbarComponent } from './shared/components/topbar/topbar.component';
import { HomeModule } from './pages/home/home.module';
@NgModule({
  declarations: [AppComponent, SidebarComponent, TopbarComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DynamicDialogModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    TableModule,
    AdministrationModule,
    ViewerModule,
    UserModule,
    HomeModule,
  ],
  providers: [DialogService],
  bootstrap: [AppComponent],
})
export class AppModule {}
