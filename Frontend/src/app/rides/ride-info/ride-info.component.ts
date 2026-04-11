import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { StatusCardComponent } from '../../components/status-card/status-card.component';
import { Ride } from '../../types';
import { Router, RouterModule } from '@angular/router';
import { RideService } from '../../service/backend/ride.service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserFeedbackService } from '../../service/frontend/user-feedback.service';

@Component({
  selector: 'app-ride-info',
  imports: [MatTooltipModule, StatusCardComponent, MatDialogTitle, MatDialogContent, TranslateModule, MatListModule, MatDividerModule, MatDialogActions, MatDialogClose, MatButtonModule, MatIconModule, RouterModule, CommonModule],
  templateUrl: './ride-info.component.html',
  styleUrl: './ride-info.component.scss'
})
export class RideInfoComponent implements OnInit {
  isAuthUserBookRide: boolean = false; 

  constructor(
    private rideService: RideService, 
    private router: Router,
    private feedbackService: UserFeedbackService,
    private dialogRef: MatDialogRef<RideInfoComponent>, @Inject(MAT_DIALOG_DATA) public data: {
      ride: Ride,
      isInfoCard: boolean,
    }
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.rideService.isAuthUserBookRide(this.data.ride.id).then(data => this.isAuthUserBookRide = data); 
  }

  rideCancel() {
    if(!this.data.isInfoCard && this.isAuthUserBookRide) {
      this.rideService.cancel(this.data.ride.id); 
      this.feedbackService.feedbackSuccess('feedback.success.cancel');
      this.dialogRef.close();
    }
  }

  rideBook() {
    if(!this.data.isInfoCard && !this.isAuthUserBookRide) {
      this.rideService.book(this.data.ride.id); 
      this.feedbackService.feedbackSuccess('feedback.success.book');
      this.dialogRef.close();
    }
  }

  goToChat() {
    if(this.data.ride) {
      this.router.navigateByUrl("/chat/" + this.data.ride.id);
      this.dialogRef.close();
    }
  }

  goToReport() {
    if(this.data.ride) {
      this.router.navigateByUrl("/report/" + this.data.ride.id);
      this.dialogRef.close();
    }
  }
}
