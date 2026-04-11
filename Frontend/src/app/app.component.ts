import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './service/backend/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private language: string = ""; 

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
  ) {
    translate.addLangs(['de', 'en']); 
    translate.setDefaultLang('de');

    this.language = localStorage.getItem('language') || '';
    if (this.language === "") {
      this.language = translate.getBrowserLang() || ''; 
    }
    translate.use(this.language?.match(/en|de/) ? this.language : 'en'); 
    localStorage.setItem('language', this.translate.currentLang); 
  }

  async ngOnInit(): Promise<void> {
    const token = localStorage.getItem('authToken');

    if (token) {
      const isValid = await this.authService.validateToken();
      if (!isValid) {
        this.router.navigate(['/login']); 
      }
    } else {
      if (this.router.url !== '/login') { 
        this.router.navigate(['/login']);
      }
    }
  }
}

