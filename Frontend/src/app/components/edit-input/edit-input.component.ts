import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { UserFeedbackService } from '../../service/frontend/user-feedback.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-edit-input',
  imports: [MatTooltipModule, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './edit-input.component.html',
  styleUrl: './edit-input.component.scss'
})
export class EditInputComponent implements OnChanges{
  @Input() label: string = "";
  @Input() value: string = "";
  @Input() isEditInput: boolean = true;
  @Input() isPhoneNumber: boolean = false; 
  @Input() isEmail: boolean = false;  
  @Input() isClazz: boolean = false; 
  @Output() sendBackValueEvent = new EventEmitter<string>();

  valueControl = new FormControl({ value: '', disabled: true });

  constructor(
    private feedbackService: UserFeedbackService,
  ){};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.valueControl.setValue(this.value);
    }
  }

  changeEditSave() {
    if(this.isEditInput) {
      if (this.valueControl.disabled) {
        this.valueControl.enable();
      } else {
        if (this.valueControl.value != null) {
          if (this.isPhoneNumber && !this.validatePhoneNumber(this.valueControl.value)) {
            this.feedbackService.feedbackError('feedback.error.phoneNumber');
            return;
          }
          if (this.isEmail && !this.validateEmail(this.valueControl.value)) {
            this.feedbackService.feedbackError('feedback.error.email');
            return;
          }
          if (this.isClazz && !this.validateClazz(this.valueControl.value)) {
            this.feedbackService.feedbackError('feedback.error.clazz');
            return;
          }
          this.valueControl.disable();
          this.sendBackValueEvent.emit(this.valueControl.value);
          this.feedbackService.feedbackError('feedback.success.update');
        }
      }
    }
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    const phoneRegEx = /^[0-9]{11}$/; 
    return phoneRegEx.test(phoneNumber);
  }

  validateEmail(email: string): boolean {
    const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
    return emailRegEx.test(email);
  }

  validateClazz(clazz: string): boolean {
    return clazz.length <= 6;
  }
}
