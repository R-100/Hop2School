import { Component, OnInit } from '@angular/core';
import { Report, User, UserForAdmin, UUID } from '../../types';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../service/backend/admin.service';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../service/backend/user.service';
import { UserFeedbackService } from '../../service/frontend/user-feedback.service';

@Component({
  selector: 'app-report-disable',
  imports: [MatTooltipModule, MatCardModule, MatButtonModule, FormsModule, CommonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, TranslateModule, MatDividerModule, RouterModule],
  templateUrl: './report-disable.component.html',
  styleUrl: './report-disable.component.scss'
})
export class ReportDisableComponent implements OnInit {
  private reporterUserId: UUID | null = null;
  reports: Report[] = [];
  reportedUser?: UserForAdmin;
  content: string = '';

  constructor(
    private activeRoute: ActivatedRoute,
    private adminService: AdminService,
    private router: Router,
    private feedbackService: UserFeedbackService,
  ) { }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(params => {
      this.reporterUserId = params.get('id');
      if (this.reporterUserId !== null && this.reporterUserId.length !== 0) {
        this.loadReports();
      }
    });

  }

  loadReports() {
    if (this.reporterUserId) {
      this.adminService.getUserReports(this.reporterUserId).then(data => this.reports = data);
      this.adminService.getUserById(this.reporterUserId).then(data => this.reportedUser = data);
    }
  }

  disableReport() {
    if (this.reporterUserId?.trim()) {
      this.adminService.reportDisable(this.reporterUserId, this.content);
      this.content = "";
      this.feedbackService.feedbackSuccess('feedback.success.disableReport')
    }
    this.router.navigateByUrl("/admin/area");
  }
}
