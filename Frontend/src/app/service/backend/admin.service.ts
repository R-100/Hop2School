import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Report, UserForAdmin, UUID } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = `${environment.url}admin`;

  constructor(private http: HttpClient) { }

  getAllUsers(): Promise<UserForAdmin[]> {
    return lastValueFrom(this.http.get<UserForAdmin[]>(`${this.baseUrl}/getAllUsers`));
  }

  getUserReports(id: UUID): Promise<Report[]> {
    return lastValueFrom(this.http.get<Report[]>(`${this.baseUrl}/getUserReports/${id}`));
  }

  getUserById(id: UUID): Promise<UserForAdmin> {
     return lastValueFrom(this.http.get<UserForAdmin>(`${this.baseUrl}/getUserById/${id}`));
  }

  reportDisable(id: UUID, message: string): void {
    lastValueFrom(this.http.post(`${this.baseUrl}/reportDisable/${id}`, message));
  }
}
