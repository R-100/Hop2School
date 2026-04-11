import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { ColumnChartComponent } from '../components/column-chart/column-chart.component';
import { DonutChartComponent } from '../components/donut-chart/donut-chart.component';
import { RideListComponent } from '../rides/ride-list/ride-list.component';
import { RideService } from '../service/backend/ride.service';
import { MatPaginatorIntlLanguage } from '../service/frontend/mat-paginator-intl-language';
import { Month, Ride, Status } from '../types';
import { data } from '@maptiler/sdk';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserFeedbackService } from '../service/frontend/user-feedback.service';

@Component({
  selector: 'app-dashbord-home',
  imports: [MatTooltipModule, RideListComponent, ColumnChartComponent, MatInputModule, MatSlideToggleModule, MatFormFieldModule, MatSelectModule, MatCardModule, TranslateModule, MatListModule, MatDividerModule, MatButtonModule, MatIconModule, CommonModule, FormsModule, DonutChartComponent],
  templateUrl: './dashbord-home.component.html',
  styleUrl: './dashbord-home.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlLanguage }
  ],
})
export class DashbordHomeComponent implements OnInit {
  myActiveRidesAndTrips: Ride[] = [];
  myPendingRidesAndTrips: Ride[] = [];
  allMyTrips: Ride[] = [];
  profit: number = 0;
  isMyRide: boolean = true;
  allTimeMyRides: number = 0;
  allTimeMyTrips: number = 1;
  averageRideLoad: number = 0; 
  reliabilityAverage: number = 0; 
  monthsLabel: string[] = ['label.months.1', 'label.months.2', 'label.months.3', 'label.months.4', 'label.months.5', 'label.months.6', 'label.months.7', 'label.months.8', 'label.months.9', 'label.months.10', 'label.months.11', 'label.months.12'];
  monthsData: Month[] = [];
  currentYear: number = 0;

  constructor(
    private rideService: RideService,
    private feedbackService: UserFeedbackService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.rideService.getMyStatusRidesAndTrips(Status.ACTIVE).then(data => this.myActiveRidesAndTrips = data);
    this.rideService.getMyStatusRidesAndTrips(Status.PENDING).then(data => this.myPendingRidesAndTrips = data);
    this.rideService.getMyTrips().then(data => this.allMyTrips = data);
    this.rideService.getAllProfit().then(data => this.profit = data);
    this.rideService.getAllTimeRides().then(data => this.allTimeMyRides = data);
    this.rideService.getAllTimeTrips().then(data => this.allTimeMyTrips = data);
    this.rideService.getAverageRideLoad().then(data => this.averageRideLoad = data);
    this.rideService.getReliabilityAverage().then(data => this.reliabilityAverage = data);
    this.currentYear = new Date().getFullYear();
    this.loadYear(this.currentYear);
  } 

  loadYear(year: number) {
    if(String(year).length === 4) {
      this.currentYear = year;
      this.rideService.getMyColumnChartByYear(year).then(data => this.monthsData = data);
    }
  }

  onYearChange(newCurrentYear: number) {
    this.loadYear(newCurrentYear); 
    this.feedbackService.feedbackSuccess('feedback.success.year');
  }
}
