import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Todo } from '../../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = 'https://localhost:7098/api/todos';

  constructor(private http: HttpClient) {}

  // Get authorization headers with token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No auth token found.');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all todos for the current user
  // FIXED: This is the key fix - don't append userId to URL
  getTodos(status: string = ''): Observable<Todo[]> {
    // The API gets the user ID from the auth token, 
    // so we don't need to add it to the URL
    const url = `${this.apiUrl}` + (status ? `?status=${status}` : '');
    
    return this.http.get<Todo[]>(url, { headers: this.getAuthHeaders() })
      .pipe(
        tap(todos => console.log('Fetched todos:', todos)),
        catchError(this.handleError<Todo[]>('getTodos', []))
      );
  }

  // Get a specific todo by ID
  getTodoById(todoId: string): Observable<Todo> {
    if (!todoId) {
      return throwError(() => new Error('Todo ID is required'));
    }
    
    return this.http.get<Todo>(`${this.apiUrl}/${todoId}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(todo => console.log('Fetched todo by ID:', todo)),
        catchError(this.handleError<Todo>('getTodoById'))
      );
  }

  // Create a new todo
  createTodo(todo: Partial<Todo>): Observable<Todo> {
    return this.http.post<Todo>(`${this.apiUrl}`, todo, { headers: this.getAuthHeaders() })
      .pipe(
        tap(newTodo => console.log('Created todo:', newTodo)),
        catchError(this.handleError<Todo>('createTodo'))
      );
  }

  // Mark a todo as complete
  markAsComplete(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/complete`, {}, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => console.log('Marked todo as complete:', id)),
        catchError(this.handleError<void>('markAsComplete'))
      );
  }

  // Delete a todo
  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(() => console.log('Deleted todo:', id)),
        catchError(this.handleError<void>('deleteTodo'))
      );
  }

  // Update a todo
  updateTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, todo, { headers: this.getAuthHeaders() })
      .pipe(
        tap(updatedTodo => console.log('Updated todo:', updatedTodo)),
        catchError(this.handleError<Todo>('updateTodo'))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      
      // Log specific details based on error type
      if (error.status === 404) {
        console.error(`${operation}: Resource not found. URL: ${error.url}`);
      } else if (error.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      return throwError(() => error);
    };
  }
}