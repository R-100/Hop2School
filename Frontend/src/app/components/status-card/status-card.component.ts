import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { Status } from '../../types';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-card',
  standalone: true,
  imports: [TranslateModule, FormsModule, CommonModule],
  templateUrl: './status-card.component.html',
  styleUrl: './status-card.component.scss'
})
export class StatusCardComponent implements OnChanges, AfterViewInit {
  @Input() activeStatus?: Status;
  @ViewChild('boxColor') boxColorRef!: ElementRef;
  private viewInitialized: boolean = false;
  private currentClazz: string | null = null;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    if (this.activeStatus) {
      this.applyClazz(this.getClazzByStatus(this.activeStatus));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeStatus'] && this.activeStatus && this.viewInitialized) {
      this.applyClazz(this.getClazzByStatus(this.activeStatus));
    }
  }

  private getClazzByStatus(status: Status): string {
    return `status-${status.toLowerCase()}`;
  }

  private applyClazz(clazzName: string) {
    const element = this.boxColorRef.nativeElement as HTMLElement;
    if (this.currentClazz) {
      this.renderer.removeClass(element, this.currentClazz);
    }
    this.renderer.addClass(element, clazzName);
    this.currentClazz = clazzName;
  }
}
