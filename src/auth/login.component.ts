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
    // Redirect to /todos if user is already logged in
    if (localStorage.getItem('authToken')) {
      this.router.navigate(['/todos']);
    }
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  // Handle form submission
  onSubmit(): void {
    // Basic validation for empty username or password
    if (!this.user.username || !this.user.password) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    this.authService.login(this.user).subscribe(
      (response: LoginResponse) => {
        // Save token and UserId in localStorage and redirect to todos page
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userId', response.userId); // Store UserId in local storage
        this.router.navigate(['/todos']); // Redirect to todos page
      },
      (error) => {
        this.errorMessage = error?.error?.message || 'Login failed, please try again';
        console.error('Login error:', error);
      }
    );
  }
}
