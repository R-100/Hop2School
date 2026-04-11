import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environments';
import { CreateRide, Month, Ride, Status, UUID } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class RideService {

  private baseUrl = `${environment.url}ride`;

  constructor(private http: HttpClient) { }

  getAllPendingRide(): Promise<Ride[]> {
    return lastValueFrom(this.http.get<Ride[]>(`${this.baseUrl}`)); 
  }

  getAllMyRide(): Promise<Ride[]> {
    return lastValueFrom(this.http.get<Ride[]>(`${this.baseUrl}/my`));
  }

  getRideById(rideId: UUID): Promise<Ride> {
    return lastValueFrom(this.http.get<Ride>(`${this.baseUrl}/${rideId}`)); 
  }

  create(command: CreateRide): void {
    lastValueFrom(this.http.post(`${this.baseUrl}`, command)); 
  }

  upadte(command: CreateRide, id: UUID): void {
    lastValueFrom(this.http.put(`${this.baseUrl}/${id}`, command));
  }

  cancel(id: UUID): void {
    lastValueFrom(this.http.post(`${this.baseUrl}/cancel/${id}`, null)); 
  }

  book(id: UUID): void {
    lastValueFrom(this.http.post(`${this.baseUrl}/book/${id}`, null)); 
  }

  isAuthUserBookRide(id: UUID): Promise<boolean> {
    return lastValueFrom(this.http.get<boolean>(`${this.baseUrl}/isAuthUserBookRide/${id}`)); 
  }  

  getMyStatusRidesAndTrips(status: Status): Promise<Ride[]> {
    return lastValueFrom(this.http.get<Ride[]>(`${this.baseUrl}/getMyStatusRidesAndTrips/${status}`));
  }

  getMyTrips(): Promise<Ride[]> {
    return lastValueFrom(this.http.get<Ride[]>(`${this.baseUrl}/getMyTrips`));
  }

  getAllProfit(): Promise<number> {
    return lastValueFrom(this.http.get<number>(`${this.baseUrl}/getAllProfit`));
  }

  getAllTimeRides(): Promise<number> {
    return lastValueFrom(this.http.get<number>(`${this.baseUrl}/getAllTimeRides`));
  }

  getAllTimeTrips(): Promise<number> {
    return lastValueFrom(this.http.get<number>(`${this.baseUrl}/getAllTimeTrips`));
  }

  getAverageRideLoad(): Promise<number> {
    return lastValueFrom(this.http.get<number>(`${this.baseUrl}/getAverageRideLoad`));
  }

  getReliabilityAverage(): Promise<number> {
    return lastValueFrom(this.http.get<number>(`${this.baseUrl}/getReliabilityAverage`));
  }

  getMyColumnChartByYear(year: number): Promise<Month[]> {
    return lastValueFrom(this.http.get<Month[]>(`${this.baseUrl}/getMyColumnChartByYear/${year}`));
  }
}
