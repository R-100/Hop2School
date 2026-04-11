import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environments';
import { CreateReported, UUID } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private baseUrl = `${environment.url}report`;

  constructor(private http: HttpClient) { }

  reported(command: CreateReported) {
    lastValueFrom(this.http.post(`${this.baseUrl}`, command)); 
  }
}
