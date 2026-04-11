import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogClose, MatDialogActions} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-legal-privacy',
  imports: [MatTooltipModule, MatDialogTitle, MatDialogContent, TranslateModule, MatListModule, MatDividerModule, MatDialogActions, MatDialogClose, MatButtonModule, MatIconModule],
  templateUrl: './legal-privacy.component.html',
  styleUrl: './legal-privacy.component.scss'
})
export class LegalPrivacyComponent {
  data = inject(MAT_DIALOG_DATA);
}
