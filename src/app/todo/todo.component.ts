import { Component, OnInit } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { HttpErrorResponse } from '@angular/common/http';
import { TodoService } from 'src/app/services/todo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';
  showSaveMessage = false;
  currentTodoId: string | null = null;

  newTodo: Partial<Todo> = {
    title: '',
    description: '',
    dueDate: new Date().toISOString(),
    status: 0,
    priority: 0,
  };

  constructor(
    private todoService: TodoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['userId'];
      const todoId = params['todoId']; // Check if we have a specific todo ID in route
      
      if (userId) {
        localStorage.setItem('userId', userId);
      }
      
      this.getTodos();
      
      // If we have a specific todo ID in the route, load that todo
      if (todoId) {
        this.loadTodoById(todoId);
      }
    });
  }

  // New method to load a specific todo by ID
  loadTodoById(todoId: string): void {
    this.loading = true;
    this.todoService.getTodoById(todoId)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        (todo: Todo) => {
          // Either edit this todo or display it, depending on your UI
          this.editTodo(todo);
          this.currentTodoId = todoId;
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.errorMessage = `Todo with ID ${todoId} does not exist.`;
          } else {
            this.errorMessage = 'Failed to load todo, please try again later.';
          }
          console.error('Error fetching todo by ID:', error);
        }
      );
  }

  getTodos(): void {
    this.loading = true;
    this.todoService.getTodos()
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        (data: Todo[]) => {
          console.log('Fetched todos:', data);
          this.todos = data;
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = 'Failed to load todos, please try again later.';
          console.error('Error fetching todos:', error);
        }
      );
  }

  createTodo(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.errorMessage = 'UserId is missing or invalid. Please log in again.';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }
  
    // Make sure we're not attempting to create a todo with an ID
    const todoToCreate: Partial<Todo> = {
      title: this.newTodo.title!.trim(),
      description: this.newTodo.description ?? '',
      dueDate: new Date(this.newTodo.dueDate!).toISOString(),
      status: 0,
      priority: this.newTodo.priority ?? 0,
      userId: userId,
    };
  
    // Explicitly ensure there's no ID in the new todo
    delete (todoToCreate as any).id;
    
    this.loading = true;
    this.todoService.createTodo(todoToCreate)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        (createdTodo: Todo) => {
          this.todos.push(createdTodo);
          this.successMessage = 'Todo created successfully!';
          this.resetForm();
        },
        (err: HttpErrorResponse) => {
          this.errorMessage = 'Failed to create todo, please try again.';
          console.error('Create Todo Error:', err);
        }
      );
  }

  updateTodoStatus(id: string): void {
    if (!id) {
      this.errorMessage = 'Invalid todo ID';
      return;
    }
    
    this.loading = true;
    this.todoService.markAsComplete(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          this.todos = this.todos.map(todo =>
            todo.id === id ? { ...todo, status: 1 } : todo
          );
          this.successMessage = 'Todo marked as complete!';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.errorMessage = `Todo with ID ${id} not found.`;
          } else {
            this.errorMessage = 'Failed to mark todo as complete.';
          }
          console.error('Update Status Error:', err);
        }
      );
  }

  deleteTodo(id: string): void {
    if (!id) {
      this.errorMessage = 'Invalid todo ID';
      return;
    }
    
    this.loading = true;
    this.todoService.deleteTodo(id)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        () => {
          this.todos = this.todos.filter(todo => todo.id !== id);
          this.successMessage = 'Todo deleted successfully!';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        (err: HttpErrorResponse) => {
          if (err.status === 404) {
            // If the todo is already gone, remove it from the UI anyway
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.successMessage = 'Todo removed from list.';
          } else {
            this.errorMessage = 'Failed to delete todo, please try again.';
          }
          console.error('Delete Todo Error:', err);
        }
      );
  }

  editTodo(todo: Todo): void {
    // Create a deep copy to avoid modifying the original todo
    this.newTodo = { ...todo };
    this.currentTodoId = todo.id;
  }

  saveTodo(): void {
    // Check if the todo already has an ID (indicating it's being updated)
    if (this.currentTodoId) {
      const todoToUpdate: Todo = {
        ...this.newTodo,
        id: this.currentTodoId
      } as Todo;
      
      this.loading = true;
      this.todoService.updateTodo(todoToUpdate)
        .pipe(finalize(() => this.loading = false))
        .subscribe(
          (updatedTodo) => {
            this.todos = this.todos.map(todo =>
              todo.id === updatedTodo.id ? { ...updatedTodo } : todo
            );
            this.successMessage = 'Todo updated successfully!';
            this.showSaveMessage = true;
            setTimeout(() => (this.showSaveMessage = false), 3000);
            this.resetForm();
          },
          (error) => {
            if (error.status === 404) {
              this.errorMessage = `Todo with ID ${this.currentTodoId} not found. It may have been deleted.`;
            } else {
              this.errorMessage = 'Failed to save todo, please try again.';
            }
            console.error('Failed to save todo:', error);
            setTimeout(() => {
              this.errorMessage = '';
            }, 3000);
          }
        );
    } else {
      // If no ID is present, it means it's a new todo
      this.createTodo();
    }
  }

  resetForm(): void {
    this.newTodo = { 
      title: '', 
      description: '', 
      dueDate: new Date().toISOString(), 
      status: 0, 
      priority: 0 
    };
    this.currentTodoId = null;
  }

  cancelEdit(): void {
    this.resetForm();
  }
}