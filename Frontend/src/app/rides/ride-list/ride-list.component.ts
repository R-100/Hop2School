import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Ride } from '../../types'; 
import { RideCardComponent } from '../../rides/ride-card/ride-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorIntlLanguage } from '../../service/frontend/mat-paginator-intl-language';

@Component({
  selector: 'app-ride-list',
  standalone: true,
  imports: [MatTooltipModule, CommonModule, MatPaginatorModule, RideCardComponent, TranslateModule],
  templateUrl: './ride-list.component.html',
  styleUrls: ['./ride-list.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlLanguage }
  ],
})
export class RideListComponent implements OnChanges {

  @Input() rides: Ride[] = [];
  @Input() mainTitle: string = '';
  @Input() pageSize = 4;
  @Input() error: string = '';
  @Input() isFindRide: boolean = false;
  @Input() isFindCardRide: boolean = false;

  pagedRides: Ride[] = [];
  pageIndex = 0;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rides']) {
      this.pageIndex = 0;
      this.updatePagedRides();
    }
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePagedRides();
  }

  updatePagedRides() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedRides = this.rides.slice(start, end);
  }
}
