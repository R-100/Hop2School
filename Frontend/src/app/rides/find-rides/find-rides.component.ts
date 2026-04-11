import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { TranslateModule } from '@ngx-translate/core';
import { MultiMapComponent } from "../../maps/multi-map/multi-map.component";
import { RideService } from '../../service/backend/ride.service';
import { UserFeedbackService } from '../../service/frontend/user-feedback.service';
import { Ride } from '../../types';
import { RideInfoComponent } from '../ride-info/ride-info.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RideListComponent } from '../ride-list/ride-list.component';

@Component({
  selector: 'app-find-rides',
  imports: [RideListComponent, MatTooltipModule, MatDatepickerModule, MatCheckboxModule, MatSliderModule, MatCardModule, MatButtonModule, MatBottomSheetModule, FormsModule, CommonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, TranslateModule, MatDividerModule, MultiMapComponent],
  templateUrl: './find-rides.component.html',
  styleUrl: './find-rides.component.scss'
})
export class FindRidesComponent implements OnInit {
  rides: Ride[] = [];
  radius: number = 0;
  isRadiusSearchActive: boolean = false;
  showSearchControl: boolean = false;
  isSearchDriveDate: boolean = false;
  isSearchDriveTimes: boolean = false;
  isFreeRides: boolean = false;
  startDate?: string;
  startTime?: string;
  endTime?: string;
  isOpenFindRidesCard: boolean = false;
  findRidesCard: Ride[] = [];

  dialog = inject(MatDialog);

  constructor(
    private rideService: RideService,
    private feedbackService: UserFeedbackService
  ) { }

  ngOnInit(): void {
    this.rideService.getAllPendingRide().then(data => {
      this.rides = data;
    });
  }

  openRideSaleHandler(ride: Ride) {
    if (ride) {
      ride.startTime = new Date('1970-01-01T' + ride.startTime + 'Z');
      ride.endTime = new Date('1970-01-01T' + ride.endTime + 'Z');
      this.dialog.open(RideInfoComponent, {
        data: {
          ride: ride,
          isInfoCard: false,
        },
      });
    }
  }

  openRidesCardHandler(rides: Ride[]) {
    if(rides.length >= 1) {
      this.findRidesCard = rides;
      this.isOpenFindRidesCard = true; 
    } else {
      this.isOpenFindRidesCard = false; 
    }
  }

  changeRadiusStatus(status: boolean) {
    this.isRadiusSearchActive = status;
    if (!status) {
      this.radius = 0;
    }
  }

  changeFreeRidesStatus(status: boolean) {
    this.isFreeRides = status;
    this.filter();
  }

  filter() {
    this.rideService.getAllPendingRide().then(data => {
      let filteredRides = data;

      if (this.isFreeRides) {
        filteredRides = filteredRides.filter(ride => +ride.price === 0);
      }

      if (this.isSearchDriveDate && this.startDate) {
        filteredRides = filteredRides.filter(ride =>
          this.formatDateToString(new Date(ride.startDate)) === this.startDate
        );
      }

      if (this.isSearchDriveTimes && this.startTime && this.endTime) {
        filteredRides = filteredRides.filter(ride =>
          ride.startTime + "" === (this.startTime + ':00') &&
          ride.endTime + "" === (this.endTime + ':00')
        );
      }
      this.rides = filteredRides;
      if (this.rides.length !== 0) {
        this.feedbackService.feedbackSuccess('feedback.success.rideFind', ": " + this.rides.length);
      } else {
        this.feedbackService.feedbackWarning('feedback.warning.rideFind');
      }
    });
  }

  formatDateToString(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}


