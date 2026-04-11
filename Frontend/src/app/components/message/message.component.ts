import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../service/backend/auth.service';
import { MessageService } from '../../service/backend/message.service';
import { RideService } from '../../service/backend/ride.service';
import { Message, Ride, User, UUID } from '../../types';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-message',
  imports: [MatTooltipModule, MatCardModule, MatButtonModule, FormsModule, MatTableModule, CommonModule, MatIconModule, ReactiveFormsModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, TranslateModule, MatDividerModule, RouterModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit {
  private id: UUID | null = null;
  messages: Message[] = [];
  ride?: Ride;
  content: string = '';
  isDriver: boolean = false;
  private authUser!: User; 

  constructor(
    private activeRoute: ActivatedRoute,
    private messageService: MessageService,
    private authService: AuthService,
    private rideService: RideService,
  ) { }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id !== null && this.id.length !== 0) {
        this.rideService.getRideById(this.id).then(data => {
        this.ride = data
        this.ride.startTime = new Date('1970-01-01T' + this.ride.startTime + 'Z');
        this.ride.endTime = new Date('1970-01-01T' + this.ride.endTime + 'Z');
      });
        this.loadMessages(); 
      }
    });
    this.authService.getAuthUser().then(data => this.authUser = data);
    this.isDriver = (this.ride?.driverId === this.authUser.id); 
  }

  loadMessages() {
    if (this.id) {
      this.messageService.getMessageByRideId(this.id).then(data => this.messages = data);
    }
  }

  messageSend() {
    if (this.content.trim() && this.ride?.id?.trim()) {
      this.messageService.sendMessage({content: this.content, rideId: this.ride.id});
      this.content = "";
    }
    this.loadMessages();
  }  

  isAuthUserId(id: UUID): boolean {
    return id === this.authUser.id; 
  }

  isDriverUser(id: UUID): boolean {
    return id === this.ride?.driverId;
  }
}
