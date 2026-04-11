import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UpdatePassword } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = `${environment.url}user`;

  constructor(private http: HttpClient) { }

  updateLanguage(command: string): void {
    lastValueFrom(this.http.post(`${this.baseUrl}/language`, command));
  }

  updateMode(command: boolean): void {
    lastValueFrom(this.http.post(`${this.baseUrl}/mode`, command));
  }

  updatePhoneNumber(command: string): void {
    lastValueFrom(this.http.post(`${this.baseUrl}/phoneNumber`, command));
  }

  updateClazz(command: string): void {
    lastValueFrom(this.http.post(`${this.baseUrl}/clazz`, command));
  }

  updateUsername(command: string): void {
    lastValueFrom(this.http.post(`${this.baseUrl}/username`, command));
  }

  updateLastname(command: string): void {
    lastValueFrom(this.http.post(`${this.baseUrl}/lastname`, command));
  }

  sendUpdatePasswordCode(): void {
    lastValueFrom(this.http.post(`${this.baseUrl}/sendUpdatePasswordCode`, null));
  }

  updatePassword(command: UpdatePassword): void {
    lastValueFrom(this.http.post(`${this.baseUrl}/password`, command));
  }

  getLanguage(): Promise<string> {
    return lastValueFrom(this.http.get<string>(`${this.baseUrl}/language`));
  }

  getIsWithMode(): Promise<boolean> {
    return lastValueFrom(this.http.get<boolean>(`${this.baseUrl}/mode`));
  }

  getGeoCodingApiKey(): Promise<string> {
    return lastValueFrom(this.http.get<string>(`${this.baseUrl}/geoCodingApiKey`));
  }
}
