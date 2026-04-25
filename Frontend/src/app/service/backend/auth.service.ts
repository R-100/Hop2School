import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Observer, catchError, firstValueFrom, lastValueFrom, map, of } from 'rxjs';
import { LoginData, Registiterung, UpdatePasswordAnonymous, User } from '../../types';
import { environment } from '../../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.url}auth`;
  private token: string = "";

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.token = localStorage.getItem('authToken') || '';
    this.isAuthenticatedSubject.next(!!this.token);
  }

  register(command: Registiterung): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, command);
  }

  login(loginData: LoginData): Observable<string> {
    return this.http.post(`${this.baseUrl}/login`, loginData, { responseType: 'text' })
      .pipe(
        map(token => {
          this.setSession(token);
          this.setSession(token);
          return token;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  setSession(token: string): void {
    localStorage.setItem('authToken', token);
    this.isAuthenticatedSubject.next(true);
  }

  isActiveAccount(email: string): Observable<boolean> {
    const params = new HttpParams().set('username', email);
    return this.http.get<boolean>(`${this.baseUrl}/isActiveAccount`, { params });
  }

  activeAccount(email: string, password: string, code: string) {
    return this.http.post(`${this.baseUrl}/isActiveAccount`, {
      email,
      password,
      code
    });
  }

  refresMail(email: string): void {
    this.http.post(`${this.baseUrl}/refresMail`, email, { responseType: 'text' })
      .subscribe(
        response => console.log("Erfolg: ", response),
        error => console.error("Fehler: ", error)
      );
  }

  validateToken(): Promise<boolean> {
    return lastValueFrom(this.http.get<boolean>(`${this.baseUrl}/validateToken/${this.token}`));
  }

  getAuthUser(): Promise<User> {
    return lastValueFrom(this.http.get<User>(`${this.baseUrl}/getAuthUser/${this.token}`));
  }

  passwordValidation(value: string): boolean {
    const isUpperCase = new RegExp(/(?=.*[A-Z])/g);
    const isSpecialChar = new RegExp(/(?=.*[!@#$%^&*])/g);
    const isLowerCase = new RegExp(/(?=.*[a-z])/g);
    const isLong = value.length >= 6;
    const isNumeric = new RegExp(/(?=.*[0-9])/g);
    const checkIsWhiteSpacefromBegAndEnd = new RegExp(/^\S.*\S$/);;
    if(value.match(isUpperCase) && value.match(isSpecialChar) && value.match(isLowerCase) && isLong && value.match(isNumeric) && value.match(checkIsWhiteSpacefromBegAndEnd)) {
      return true;
    }
    return false;
  }

  sendUpdatePasswordCodeAnonymous(mail: string): void {
    lastValueFrom(this.http.post(`${this.baseUrl}/sendUpdatePasswordCodeAnonymous`, mail));
  }

  updatePasswordAnonymous(command: UpdatePasswordAnonymous): void {
    lastValueFrom(this.http.post(`${this.baseUrl}/updatePasswordAnonymous`, command));
  }
}
