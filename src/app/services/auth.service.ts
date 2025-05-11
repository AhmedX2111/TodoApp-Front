import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Import the tap operator
import { env } from '../../../src/env';
import { LoginResponse } from '../../models/Login-response.model';  // Adjust the import path as necessary

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${env.apiUrl}`;
  router: any;

  constructor(private http: HttpClient) {}

  // Refactored login method using tap to handle storing the token
  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: LoginResponse) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token); // Store token in localStorage
        }
      })
    );
  }

  // Signup method to register a new user
  signup(user: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

  // Store token manually (if needed)
  storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Logout method to remove token from localStorage
  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  // Check if user is authenticated based on the presence of the token
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
