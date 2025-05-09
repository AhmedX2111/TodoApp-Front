import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // ✅ Required
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module'; 

import { AppComponent } from './app.component';
import { TodoComponent } from './todo/todo.component';
import { LoginComponent } from '../auth/login.component';
import { SignupComponent } from '../auth/signup.component';

const routes: Routes = [
  { path: '', component: TodoComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    TodoComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule, // ✅ Fix: add HttpClientModule
    AppRoutingModule, 
    RouterModule.forRoot(routes) // ✅ Fix: register routes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
