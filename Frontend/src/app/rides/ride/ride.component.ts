import { Component, OnInit } from '@angular/core';
import { Adress, CreateRide, Ride, User, UUID } from '../../types';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RideService } from '../../service/backend/ride.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SoloMapComponent } from '../../maps/solo-map/solo-map.component';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserFeedbackService } from '../../service/frontend/user-feedback.service';

@Component({
  selector: 'app-ride',
  imports: [MatTooltipModule, MatNativeDateModule, MatTimepickerModule, MatDatepickerModule, MatCardModule, MatButtonModule, FormsModule, CommonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, TranslateModule, MatDividerModule, RouterModule, SoloMapComponent],
  templateUrl: './ride.component.html',
  styleUrl: './ride.component.scss'
})
export class RideComponent implements OnInit {
  private id: UUID | null = null;
  isUpdate: boolean = false;
  rideFrom!: FormGroup;
  value!: Date;
  adress!: Adress;

  constructor(
    private activeRoute: ActivatedRoute,
    private rideService: RideService,
    private router: Router,
    private formBuilder: FormBuilder,
    private feedbackService: UserFeedbackService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.activeRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.isUpdate = this.id !== null;
    });
    this.rideFrom = this.formBuilder.group({
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      street: [''],
      houseNumber: [''],
      city: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      price: [0],
      seats: [1, Validators.required],
    });
    this.rideFrom.valueChanges.subscribe(value => {
      this.adress = { houseNumber: value.houseNumber, city: value.city, postalCode: value.postalCode, street: value.street };
    });
    if (this.id !== null) {
      this.rideService.getRideById(this.id).then(data => {
        this.rideFrom.patchValue({
          postalCode: data.postalCode,
          street: data.street,
          houseNumber: data.houseNumber,
          city: data.city,
          startDate: data.startDate,
          startTime: data.startTime,
          endTime: data.endTime,
          price: data.price,
          seats: data.seats,
        });
      });
    }
  }

  public submitForm(): void {
    if (this.rideFrom.valid) {
      const command: CreateRide = {
        postalCode: this.rideFrom.get('postalCode')?.value,
        street: this.rideFrom.get('street')?.value,
        houseNumber: this.rideFrom.get('houseNumber')?.value,
        city: this.rideFrom.get('city')?.value,
        startDate: this.rideFrom.get('startDate')?.value,
        startTime: this.rideFrom.get('startTime')?.value,
        endTime: this.rideFrom.get('endTime')?.value,
        price: (this.rideFrom.get('price')?.value && this.rideFrom.get('price')?.value.toString().replace(',', '.')) || '0',
        seats: this.rideFrom.get('seats')?.value,
      };
      if (this.isUpdate && this.id !== null) {
        this.rideService.upadte(command, this.id);
        this.router.navigateByUrl("/ride/my");
        this.feedbackService.feedbackSuccess('feedback.success.update');
      } else {
        this.rideService.create(command);
        this.router.navigateByUrl("/ride/my");
        this.feedbackService.feedbackSuccess('feedback.success.add')
      }
    } else {
      this.rideFrom.markAllAsTouched();
    }
  }
}
