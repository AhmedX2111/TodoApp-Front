import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
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
    // Basic validation for empty fields
    if (!this.user.username || !this.user.password) {
      this.errorMessage = 'Please fill in both username and password.';
      return;
    }

    // Trim spaces for username and password
    const signupData = {
      username: this.user.username.trim(),
      password: this.user.password.trim(),
    };

    this.authService.signup(signupData).subscribe(
      (response) => {
        console.log('User signed up:', response);
        localStorage.setItem('userId', response.id); // Store UserId in local storage
        alert('Signup successful! Redirecting to login page.');
        this.router.navigate(['/login']); // Redirect to login page
      },
      (error) => {
        // Check if backend has any specific error message
        this.errorMessage = error?.error?.message || 'Signup failed, please try again.';
        console.error('Signup error:', error);
      }
    );
  }
}
