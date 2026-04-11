import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-help-docu',
  imports: [MatTooltipModule, RouterModule, MatButtonModule, TranslateModule],
  templateUrl: './help-docu.component.html',
  styleUrl: './help-docu.component.scss'
})
export class HelpDocuComponent {

  constructor(private router: Router) {}

  goBack() {
    this.router.navigateByUrl("/"); 
  }
}
