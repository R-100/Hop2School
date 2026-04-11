import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CodeInputComponent } from '../../components/code-input/code-input.component';
import { AuthService } from '../../service/backend/auth.service';
import { UserFeedbackService } from '../../service/frontend/user-feedback.service';
import { LoginData } from '../../types';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatTooltipModule, FormsModule, TranslateModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, CommonModule, RouterModule, MatDividerModule, CodeInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isPasswordVisible: boolean = false;
  isAccountActive: boolean = false;
  getAccountActive: boolean | null = null;
  isCodeNull: boolean = false;
  private code: string = '';

  constructor(
    private authService: AuthService, 
    private feedbackService: UserFeedbackService,
    private http: HttpClient, 
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  changePasswordVisible() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  submitForm() {
    if(this.loginForm.valid) {
      const command: LoginData = {
        password: this.loginForm.get('password')?.value,
        email: this.loginForm.get('email')?.value
      };
      this.authService.isActiveAccount(command.email).subscribe({
        next: (status: boolean) => {
          this.getAccountActive = status;
        },
        error: (error) => {
          console.error('Error retrieving account status:', error);
          this.getAccountActive = null;
        }
      });
      this.authService.login(command).subscribe({
        next: (token) => {
          if(token.length !== 0) {
            if (this.getAccountActive) {
              this.authService.setSession(token);
              this.router.navigate(['/']);
            } else {
              this.isAccountActive = true;
            }
          } else {
            this.feedbackService.feedbackError('feedback.error.reportStatusTrue');
          }
        },
        error: () => this.feedbackService.feedbackError('feedback.error.login')
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  accountActive() {
    if(this.code.length === 6) {
      this.authService.activeAccount(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value, this.code);
      this.isAccountActive = false;
    } else {
      this.isCodeNull = true;
    }
  }

  toLoginPage() {
    this.isAccountActive = false;
  }

  refreshMail() {
    this.authService.refresMail(this.loginForm.get('email')?.value);
  }

  setCode(value: string) {
    this.code = value;
  }
}
