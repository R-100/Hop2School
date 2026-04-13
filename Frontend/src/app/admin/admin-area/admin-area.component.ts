import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntlLanguage } from '../../service/frontend/mat-paginator-intl-language';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { UserForAdmin } from '../../types';
import { AdminService } from '../../service/backend/admin.service';

@Component({
  selector: 'app-admin-area',
  imports: [MatTooltipModule, MatCardModule, MatButtonModule, FormsModule, MatTableModule, CommonModule, MatIconModule, ReactiveFormsModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, TranslateModule, MatDividerModule, RouterModule],
  templateUrl: './admin-area.component.html',
  styleUrl: './admin-area.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlLanguage }
  ],
})
export class AdminAreaComponent implements AfterViewInit, OnInit {
  data: UserForAdmin[] = [];

  displayedColumns: string[] = ['username', 'lastname', 'email', 'reportStatus', 'reportCount', 'action'];
  dataSource = new MatTableDataSource<UserForAdmin>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private service: AdminService,
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.service.getAllUsers().then(data => {
      this.data = data;
      this.dataSource.data = data;
    });
  }
}
