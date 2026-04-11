import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LegalPrivacyComponent } from '../../legal-privacy/legal-privacy.component';
import { AuthService } from '../../service/backend/auth.service';
import { UserService } from '../../service/backend/user.service';
import { SettingsComponent } from '../../settings/settings.component';
import { UserComponent } from '../../user/user.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  imports: [MatTooltipModule, CommonModule, MatIconModule, MatButtonModule, MatToolbarModule, MatSidenavModule, MatListModule, RouterModule, TranslateModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile: boolean = true;
  isCollapsed:boolean = true;

  dialog = inject(MatDialog);

  constructor(
    private observer: BreakpointObserver,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {  
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if(screenSize.matches){
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  toggleMenu() {
    if(this.isMobile){
      this.sidenav.toggle();
      this.isCollapsed = false; 
      this.sidenav.open(); 
      this.isCollapsed = !this.isCollapsed;
    } else {
      this.sidenav.open();
      this.isCollapsed = !this.isCollapsed;
    }
  }

  logout() {
    this.authService.logout();
  }

  openLegalPrivacy() {
    this.dialog.open(LegalPrivacyComponent);
  }

  openUserOptions() {
    this.dialog.open(UserComponent);
  }

  openSettings() {
    this.dialog.open(SettingsComponent);
  }
}
