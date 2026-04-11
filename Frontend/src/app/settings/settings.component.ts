import { Component, inject } from '@angular/core';
import { UserService } from '../service/backend/user.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../service/frontend/theme.service';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-settings',
  imports: [MatTooltipModule, MatInputModule, MatSlideToggleModule, MatFormFieldModule, MatSelectModule, MatDialogTitle, MatDialogContent, TranslateModule, MatListModule, MatDividerModule, MatDialogActions, MatDialogClose, MatButtonModule, MatIconModule, CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  data = inject(MAT_DIALOG_DATA);
  currentLanguage: string = '';
  currentTheme?: boolean; 

  constructor(
    private themeService: ThemeService, 
    private translate: TranslateService,
    private userService: UserService
  ){}

  ngOnInit(): void {
    this.currentLanguage = localStorage.getItem('language') || '';
    this.currentTheme = this.themeService.currentTheme;
  }

  changeLanguage(language: string) {
    if(language.length === 2) {
      this.userService.updateLanguage(language); 
      this.userService.getLanguage().then(data => this.currentLanguage = data);
      this.translate.use(language);
      this.currentLanguage = language;
      localStorage.setItem('language', language); 
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme(); 
    this.currentTheme = this.themeService.currentTheme;
  } 
}
