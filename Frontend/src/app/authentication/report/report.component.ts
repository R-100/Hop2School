import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReportService } from '../../service/backend/report.service';
import { UserFeedbackService } from '../../service/frontend/user-feedback.service';
import { CreateReported, UUID } from '../../types';

@Component({
  selector: 'app-report',
  imports: [MatTooltipModule, MatNativeDateModule, MatTimepickerModule, MatDatepickerModule, MatCardModule, MatButtonModule, FormsModule, CommonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, TranslateModule, MatDividerModule, RouterModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {
  private userId: UUID | null = null; 
  reportFrom!: FormGroup;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private feedbackService: UserFeedbackService,
  ) { }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(params => {
      this.userId = params.get('id');
    });
    this.reportFrom = this.formBuilder.group({
      subject: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  public submitForm(): void {
    if (this.reportFrom.valid && (this.userId !== null && this.userId.length !== 0)) {
      const command: CreateReported = { 
        userId: this.userId,
        subject: this.reportFrom.get('subject')?.value,
        description: this.reportFrom.get('description')?.value,
      };      
      this.reportService.reported(command); 
      this.router.navigateByUrl("/ride/find");
      this.feedbackService.feedbackSuccess('feedback.success.report');
    } else {
      this.reportFrom.markAllAsTouched();
    }
  }
}
