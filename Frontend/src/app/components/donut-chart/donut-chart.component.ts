import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-donut-chart',
  imports: [MatTooltipModule, TranslateModule, CommonModule, FormsModule],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss'
})
export class DonutChartComponent {
  @Input() percentage: number = 0;
  @Input() mainTitle: string = "";
  @Input() mainPart: string = "";
  @Input() residualPart: string = "";

  readonly radius = 45;
  readonly circumference = 2 * Math.PI * this.radius;
  
  get offset(): number {
    const percent = Math.min(Math.max(this.percentage, 0), 100);
    return this.circumference * (1 - percent / 100);
  }
}
