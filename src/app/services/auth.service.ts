import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../../src/env';
import { LoginResponse } from '../../models/Login-response.model';  // Adjust the import path as necessary

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${env.apiUrl}`;

  constructor(private http: HttpClient) {}

  login(user: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, user);
  }

  signup(user: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }
}
