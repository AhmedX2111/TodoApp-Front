import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todo-ui';

  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
}
