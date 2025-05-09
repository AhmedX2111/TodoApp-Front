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
    if (localStorage.getItem('authToken')) {
      this.router.navigate(['/todos']);
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    if (!this.user.username || !this.user.password) {
      alert('Please fill in all required fields.');
      return;
    }

    const signupData = {
      username: this.user.username.trim(),
      password: this.user.password.trim(),
    };

    this.authService.signup(signupData).subscribe(
      (response) => {
        console.log('User signed up:', response);
        alert('Signup successful! Redirecting to login page.'); 
        this.router.navigate(['/login']);
      },
      (error) => {
        this.errorMessage = 'Signup failed, please try again';
        alert('Signup failed. Please check your input and try again.'); 
        console.error('Signup error:', error);
      }
    );
  }
}
