import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environments';
import { CreateMessage, Message, UUID } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private baseUrl = `${environment.url}message`;

  constructor(private http: HttpClient) { }

  getMessageByRideId(id: UUID): Promise<Message[]> {
    return lastValueFrom(this.http.get<Message[]>(`${this.baseUrl}/${id}`)); 
  }

  sendMessage(command: CreateMessage) {
    lastValueFrom(this.http.post(`${this.baseUrl}`, command)); 
  }
}
