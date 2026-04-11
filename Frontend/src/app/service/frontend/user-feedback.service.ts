import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class UserFeedbackService {
  private delayTime: number = 1000 * 3;
  private readonly _snackBar = inject(MatSnackBar);

  constructor(
    private translateService: TranslateService
  ) {}

  private sendFeedbackMesssage(message: string, panelClass: string): void {
    this._snackBar.open(message, '', {
      duration: this.delayTime,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [panelClass],
    });
  }
  
  feedbackSuccess(translateMessage: string, addMessage: string = '') {
    this.sendFeedbackMesssage(this.translateService.instant(translateMessage + addMessage), "custom-snackbar-success");
  }

  feedbackWarning(translateMessage: string, addMessage: string = '') {
    this.sendFeedbackMesssage(this.translateService.instant(translateMessage + addMessage), "custom-snackbar-warning");
  }

  feedbackError(translateMessage: string, addMessage: string = '') {
    this.sendFeedbackMesssage(this.translateService.instant(translateMessage + addMessage), "custom-snackbar-error");
  }

  feedbackInfo(translateMessage: string, addMessage: string = '') {
    this.sendFeedbackMesssage(this.translateService.instant(translateMessage + addMessage), "custom-snackbar-info");
  }
}
