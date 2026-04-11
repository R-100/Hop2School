import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CodeInputComponent } from '../../components/code-input/code-input.component';
import { AuthService } from '../../service/backend/auth.service';
import { UserFeedbackService } from '../../service/frontend/user-feedback.service';
import { UpdatePasswordAnonymous } from '../../types';

@Component({
  selector: 'app-reset-password',
  imports: [RouterModule, ReactiveFormsModule, MatTooltipModule, MatInputModule, MatSlideToggleModule, MatFormFieldModule, MatSelectModule, MatCardModule, TranslateModule, MatListModule, MatDividerModule, MatButtonModule, MatIconModule, CommonModule, FormsModule, CodeInputComponent, MatCheckboxModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  isCodeNull: boolean = false;
  isPasswordVisible: boolean = false;
  resetForm!: FormGroup;
  private code: string = '';

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private feedBackService: UserFeedbackService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator.bind(this)]],
      confirmPassword: ['', [Validators.required, this.confirmPassword.bind(this)]],
    });
  }

  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    return this.authService.passwordValidation(control.value) ? null : { passwordInvalid: true };
  }

  private confirmPassword(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    return control.value === this.resetForm.get('password')?.value ? null : { confirmPassword: true };
  }

  changePasswordVisible() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  sendCode() {
    if(this.resetForm.valid) {
      this.authService.sendUpdatePasswordCodeAnonymous(this.resetForm.get('email')?.value);
    }  else {
      this.resetForm.markAllAsTouched();
    }
  }

  setCode(value: string) {
    this.code = value;
  }

  updatePassword() {
    if (this.code.length == 6 && this.resetForm.valid) {
      const value: UpdatePasswordAnonymous = { activeCode: this.code, password: this.resetForm.get('password')?.value, email: this.resetForm.get('email')?.value };
      this.authService.updatePasswordAnonymous(value);
      this.router.navigate(['/login']);
      this.feedBackService.feedbackSuccess('feedback.success.update');
    }  else {
      this.resetForm.markAllAsTouched();
    }
  }
}
