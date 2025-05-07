import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'https://localhost:7098/api/todo';

  constructor(private http: HttpClient) { }

  // Get all todos
  getTodos(status?: string): Observable<Todo[]> {
    let url = this.apiUrl;
    if (status) {
      url = `${url}?status=${status}`;
    }
    return this.http.get<Todo[]>(url);
  }

  // Get a specific todo by id
  getTodoById(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  // Create a new todo
  createTodo(todo: Partial<Todo>): Observable<any> {
    return this.http.post(`${this.apiUrl}`, todo);
  }
  

  // Update an existing todo
  updateTodo(id: string, todo: Todo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, todo);
  }

  // Mark a todo as complete
  markAsComplete(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/complete`, {});
  }

  // Delete a todo
  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
