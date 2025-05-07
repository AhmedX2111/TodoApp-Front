import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // ✅ Required
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { TodoComponent } from './todo/todo.component';

const routes: Routes = [
  { path: '', component: TodoComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    TodoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,  // ✅ Fix: allows HttpClient usage
    RouterModule.forRoot(routes) // ✅ Fix: register routes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
