import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ReportComponent } from './authentication/report/report.component';
import { HelpDocuComponent } from './components/help-docu/help-docu.component';
import { MessageComponent } from './components/message/message.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashbordHomeComponent } from './dashbord-home/dashbord-home.component';
import { FindRidesComponent } from './rides/find-rides/find-rides.component';
import { MyRidesComponent } from './rides/my-rides/my-rides.component';
import { RideComponent } from './rides/ride/ride.component';
import { AuthGuard } from './service/frontend/auth.guard';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'resetPassword', component: ResetPasswordComponent },
  {
    path: '',
    component: NavbarComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashbordHomeComponent },
      {
        path: 'ride', children: [
          { path: 'my', component: MyRidesComponent },
          { path: 'find', component: FindRidesComponent },
          { path: 'add', component: RideComponent },
          { path: ':id', component: RideComponent}
        ]
      },
      {
        path: 'chat', children: [
          { path: ':id', component: MessageComponent },
        ]
      },
      {
        path: 'report', children: [
          { path: ':id', component: ReportComponent },
        ]
      },
    ],
  },
  { path: 'help', component: HelpDocuComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];