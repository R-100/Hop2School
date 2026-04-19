import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { StatusCardComponent } from '../../components/status-card/status-card.component';
import { MultiMapComponent } from "../../maps/multi-map/multi-map.component";
import { RideService } from '../../service/backend/ride.service';
import { MatPaginatorIntlLanguage } from '../../service/frontend/mat-paginator-intl-language';
import { Adress, Ride, Status, UUID } from '../../types';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-my-rides',
  imports: [MatTooltipModule, StatusCardComponent, MatCardModule, MatButtonModule, FormsModule, MatTableModule, CommonModule, MatIconModule, ReactiveFormsModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, TranslateModule, MatDividerModule, RouterModule, MultiMapComponent],
  templateUrl: './my-rides.component.html',
  styleUrl: './my-rides.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlLanguage }
  ],
})
export class MyRidesComponent implements AfterViewInit, OnInit {
  data: Ride[] = [];
  findAdress: Adress | null = null;

  displayedColumns: string[] = ['status', 'adress', 'time', 'seats', 'profit', 'action'];
  dataSource = new MatTableDataSource<Ride>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private rideService: RideService,
  ) { }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.data = [];
    this.rideService.getAllMyRide().then(data => {
      if (!data) return;
      this.data = data;
      this.dataSource.data = data;
    });
  }

async rideCancel(id: UUID) {
  await this.rideService.cancel(id);
  this.loadData();
  this.dataSource.data = [...this.data];
}

  isButtonVisible(status: Status): boolean {
    return status === Status.ACTIVE || status === Status.PENDING;
  }

  markerRideOnMap(ride: Ride) {
    if (!ride) return;
    this.findAdress = {
      city: ride.city,
      postalCode: ride.postalCode,
      street: ride.street,
      houseNumber: ride.houseNumber
    };
  }
}