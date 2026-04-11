import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../service/frontend/theme.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { EditInputComponent } from '../components/edit-input/edit-input.component';
import { UpdatePassword, User } from '../types';
import { AuthService } from '../service/backend/auth.service';
import { UserService } from '../service/backend/user.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CodeInputComponent } from '../components/code-input/code-input.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserFeedbackService } from '../service/frontend/user-feedback.service';

@Component({
  selector: 'app-user',
  imports: [ReactiveFormsModule, MatTooltipModule, EditInputComponent, MatInputModule, MatSlideToggleModule, MatFormFieldModule, MatSelectModule, MatDialogTitle, MatDialogContent, TranslateModule, MatListModule, MatDividerModule, MatDialogActions, MatDialogClose, MatButtonModule, MatIconModule, CommonModule, FormsModule, CodeInputComponent, MatCheckboxModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  user?: User;
  isPasswordUpdate: boolean = false;
  isCodeNull: boolean = false;
  isPasswordVisible: boolean = false;
  passwordForm!: FormGroup;
  private code: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private feedBackService: UserFeedbackService
  ) { }

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, this.passwordValidator.bind(this)]],
      confirmPassword: ['', [Validators.required, this.confirmPassword.bind(this)]],
    });
    this.authService.getAuthUser().then(data => this.user = data);
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
    return control.value === this.passwordForm.get('password')?.value ? null : { confirmPassword: true };
  }

  updatePassword() {
    if (this.code.length == 6 && this.passwordForm.valid) {
      const value: UpdatePassword = { activeCode: this.code, password: this.passwordForm.get('password')?.value };
      this.userService.updatePassword(value);
      this.isPasswordUpdate = false;
      this.feedBackService.feedbackSuccess('feedback.success.update');
    }  else {
      this.passwordForm.markAllAsTouched();
    }
  }

  changePasswordVisible() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  changeToUpdatePassword() {
    this.sendCode();
    this.isPasswordVisible = false;
    this.passwordForm.reset();
    this.isPasswordUpdate = true;
  }

  sendCode() {
    this.userService.sendUpdatePasswordCode();
  }

  setCode(value: string) {
    this.code = value;
  }

  updateUsername(value: string) {
    this.userService.updateUsername(value);
  }

  updateLastname(value: string) {
    this.userService.updateLastname(value);
  }

  updatePhoneNumber(value: string) {
    this.userService.updatePhoneNumber(value);
  }

  updateClazz(value: string) {
    this.userService.updateClazz(value);
  }

  logout() {
    this.authService.logout();
  }
}
