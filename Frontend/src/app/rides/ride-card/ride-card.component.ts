import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { Ride, Status, User, UUID } from '../../types';
import { AuthService } from '../../service/backend/auth.service';
import { RouterModule } from '@angular/router';
import { RideService } from '../../service/backend/ride.service';
import { MatDialog } from '@angular/material/dialog';
import { RideInfoComponent } from '../ride-info/ride-info.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-ride-card',
  imports: [MatTooltipModule, RouterModule, MatInputModule, MatSlideToggleModule, MatFormFieldModule, MatSelectModule, MatCardModule, TranslateModule, MatListModule, MatDividerModule, MatButtonModule, MatIconModule, CommonModule, FormsModule],
  templateUrl: './ride-card.component.html',
  styleUrl: './ride-card.component.scss'
})
export class RideCardComponent implements OnInit{
  @Input() ride?: Ride; 
  @Input() isFindCardRide: boolean = false;
  isDriver: boolean = false;

  dialog = inject(MatDialog);

  constructor(
    private authService: AuthService,
    private rideService: RideService,
  ){}

  ngOnInit(): void {
    this.authService.getAuthUser().then(data => {
      if(data && this.ride) {
        this.isDriver = (this.ride?.driverId === data.id);
        this.ride.startTime = new Date('1970-01-01T' + this.ride.startTime + 'Z');
        this.ride.endTime = new Date('1970-01-01T' + this.ride.endTime + 'Z');
      }
    });
  }

  rideCancel() {
    if(this.ride) {
      this.rideService.cancel(this.ride?.id);
    } 
  }

  openRideInfo() {
    if (this.ride) {
      this.dialog.open(RideInfoComponent, {
        data: { 
          ride: this.ride, 
          isInfoCard: true,
        },
      });
    }
  }  

  openRide() {
    if (this.ride) {
      this.dialog.open(RideInfoComponent, {
        data: { 
          ride: this.ride, 
          isInfoCard: false,
        },
      });
    }
  } 

  isButtonVisible(): boolean {
    return this.ride?.status === Status.ACTIVE || this.ride?.status === Status.PENDING;
  }
}
