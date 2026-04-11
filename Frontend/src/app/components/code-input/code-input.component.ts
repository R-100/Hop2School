import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserFeedbackService } from '../../service/frontend/user-feedback.service';

@Component({
  selector: 'app-code-input',
  imports: [MatTooltipModule, FormsModule, TranslateModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, CommonModule, RouterModule, MatDividerModule],
  templateUrl: './code-input.component.html',
  styleUrl: './code-input.component.scss'
})
export class CodeInputComponent {
  @Input() mainTitle: string = '';
  @Input() inputTitle: string = '';
  @Input() isNotNullError: boolean = false;
  @Output() refresOutputEvent = new EventEmitter();
  @Output() codeOutputEvent = new EventEmitter<string>();

  codes: number[] = Array(6).fill(0);
  valueCodes: string[] = Array(6).fill('');
  resultCode: string = '';
  isNotNumberError: boolean = false;
  
  @ViewChildren('codeInput') fieldInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(
    private feedbackService: UserFeedbackService
  ) {}

  moveFocus(event: Event, currentIndex: number) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 0) {
      const nextIndex = currentIndex + 1;
      if (nextIndex < this.fieldInputs.length) {
        this.fieldInputs.toArray()[nextIndex].nativeElement.focus();
      }
    }
  }

  handleKeyDown(event: KeyboardEvent, currentIndex: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && input.value.length === 0) {
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        this.fieldInputs.toArray()[prevIndex].nativeElement.focus();
      }
    }
  }

  isNumbers(value: string) {
    return /^[0-9]+$/.test(value);
  }

  refresOutput() {
    this.refresOutputEvent.emit();
    this.feedbackService.feedbackSuccess('feedback.success.refreshMail');
  }

  codeOutput() {
    this.resultCode = this.valueCodes.join('');
    this.isNotNumberError = false;
    this.isNotNullError = false;
    if (this.resultCode.length === 6) {  
      if (this.isNumbers(this.resultCode)) {
        this.codeOutputEvent.emit(this.resultCode);        
      } else {
        this.isNotNumberError = true;
      }
    } else {
      this.isNotNullError = true;
    }
  }
}
