import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LegalPrivacyComponent } from '../../legal-privacy/legal-privacy.component';
import { AuthService } from '../../service/backend/auth.service';
import { UserFeedbackService } from '../../service/frontend/user-feedback.service';
import { Registiterung } from '../../types';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatTooltipModule, FormsModule, MatCardModule, TranslateModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, RouterModule, MatDividerModule, MatIconModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  isLegalPrivacyAccepted: boolean = false;
  registerForm!: FormGroup;
  isPasswordVisible: boolean = false;
  isLegalError: boolean = false;
  dialog = inject(MatDialog);

  constructor(
    private authService: AuthService,
    private feedbackService: UserFeedbackService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      lastname: [''],
      phoneNumber: [''],
      clazz: [''],
      password: ['', [Validators.required, this.passwordValidator.bind(this)]],
      confirmPassword: ['', [Validators.required, this.confirmPassword.bind(this)]],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, this.confirmEmail.bind(this)]],
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
    return control.value === this.registerForm.get('password')?.value ? null : { confirmPassword: true };
  }

  private confirmEmail(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    return control.value === this.registerForm.get('email')?.value ? null : { confirmEmail: true };
  }

  changePasswordVisible() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  submitForm() {
    if (this.registerForm.valid && this.isLegalPrivacyAccepted) {
      const command: Registiterung = {
        username: this.registerForm.get('username')?.value,
        lastname: this.registerForm.get('lastname')?.value,
        password: this.registerForm.get('password')?.value,
        email: this.registerForm.get('email')?.value,
        phoneNumber: this.registerForm.get('phoneNumber')?.value,
        clazz: this.registerForm.get('clazz')?.value
      };
      this.authService.register(command).subscribe(() => {
        this.router.navigate(['/login']);
        this.feedbackService.feedbackSuccess('feedback.success.register');
      }, error => {
        console.error('Registration error: ', error);
        this.feedbackService.feedbackError('feedback.error.registerFaild');
      });
    } else {
      this.isLegalError = !this.isLegalPrivacyAccepted;
      this.registerForm.markAllAsTouched();
    }
  }

  changeLegalPrivacyAccepted() {
    this.isLegalPrivacyAccepted = !this.isLegalPrivacyAccepted;
  }

  openLegalPrivacy() {
    this.dialog.open(LegalPrivacyComponent);
  }
}
