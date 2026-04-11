import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Month } from '../../types';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-column-chart',
  imports: [MatOptionModule, FormsModule, CommonModule, TranslateModule, MatTooltipModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss'],
})
export class ColumnChartComponent implements OnChanges {
  @Input() currentYear: number = 0;
  @Input() mainTitle: string = '';
  @Input() mainPart: string = '';
  @Input() secondaryPart: string = '';
  @Input() yAxisLabels: number[] = [];
  @Input() maxYAxisLabels: number = 0;
  @Input() xAxisLabels: string[] = [];
  @Input() monthsData: Month[] = [];
  @Output() onYearChangeEvent = new EventEmitter<number>();
  lastYear: number = 0;
  years: number[] = [];

  data: { monat: string; mainColumn: number; secondaryColumn: number }[] = [];
  
  constructor() {
    this.currentYear = new Date().getFullYear();
    for (let year = this.currentYear; year >= 2020; year--) {
      this.years.push(year);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['xAxisLabels'] || changes['monthsData']) {
      this.buildData();
    }
    this.lastYear = this.currentYear; 
  }

  buildData() {
    this.data = this.xAxisLabels.map((label, index) => ({
      monat: label,
      mainColumn: this.monthsData[index]?.mainColumn || 0,
      secondaryColumn: this.monthsData[index]?.secondaryColumn || 0,
    }));
  }

  onYearChange(newCurrentYear: number) {
    if(newCurrentYear !== this.lastYear) {
      this.onYearChangeEvent.emit(newCurrentYear);
      this.lastYear = newCurrentYear;
    }
  }
}
