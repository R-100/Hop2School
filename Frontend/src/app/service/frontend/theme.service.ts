import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { UserService } from '../backend/user.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private isDarkMode = true;

  constructor(private userService: UserService) {
    this.initializeTheme();
  }

  async toggleTheme(): Promise<void> {
    this.isDarkMode = !this.isDarkMode;
    await this.userService.updateMode(this.isDarkMode);
    this.applyTheme();
  }

  get currentTheme(): boolean {
    return this.isDarkMode;
  }

  private async initializeTheme(): Promise<void> {
    this.isDarkMode = await this.userService.getIsWithMode();
    this.applyTheme();
  }

  private applyTheme(): void {
    const classList = this.document.documentElement.classList;
    classList.toggle('dark-mode', !this.isDarkMode);
  }
}
