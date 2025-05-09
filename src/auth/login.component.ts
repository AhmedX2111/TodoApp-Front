import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';
import { LoginResponse } from '../models/Login-response.model';  

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  user = { username: '', password: '' };
  errorMessage = '';
  isPasswordVisible = false;

  constructor(private authService: AuthService, private router: Router) {
    if (localStorage.getItem('authToken')) {
      this.router.navigate(['/todos']);
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    this.authService.login(this.user).subscribe(
      (response: LoginResponse) => {
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/todos']);
      },
      (error) => {
        this.errorMessage = 'Login failed, please try again';
        console.error('Login error:', error);
      }
    );
  }
}
