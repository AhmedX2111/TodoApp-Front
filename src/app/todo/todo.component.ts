import { Component, OnInit } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { HttpErrorResponse } from '@angular/common/http';
import { TodoService } from 'src/app/services/todo.service';

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

  newTodo: Partial<Todo> = {
    title: '',
    description: '',
    dueDate: new Date().toISOString(),
    status: 0,
    priority: 0,
  };

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.getTodos();
  }

  getTodos(): void {
    this.loading = true;
    this.todoService.getTodos().subscribe(
      (data: Todo[]) => {
        this.todos = data;
        this.loading = false;
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = 'Failed to load todos, please try again later.';
        console.error(error);
        this.loading = false;
      }
    );
  }

  createTodo(): void {
    const validTodo: Partial<Todo> = {
      title: this.newTodo.title!.trim(),
      description: this.newTodo.description ?? '',
      dueDate: new Date(this.newTodo.dueDate!).toISOString(),
      status: 0,
      priority: this.newTodo.priority ?? 0,
    };

    this.todoService.createTodo(validTodo).subscribe(
      () => {
        this.getTodos();
        this.successMessage = 'Todo created successfully!';
        this.newTodo = { title: '', description: '', dueDate: new Date().toISOString(), status: 0, priority: 0 };
      },
      (err: HttpErrorResponse) => {
        this.errorMessage = 'Failed to create todo, please try again.';
        console.error('Create Todo Error:', err);
      }
    );
  }

  updateTodoStatus(id: string): void {
    this.todoService.markAsComplete(id).subscribe(
      () => {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.successMessage = 'Todo marked as complete!';
      },
      (err: HttpErrorResponse) => {
        this.errorMessage = 'Failed to mark todo as complete.';
        console.error('Update Status Error:', err);
      }
    );
  }

  deleteTodo(id: string): void {
    this.todoService.deleteTodo(id).subscribe(
      () => {
        this.getTodos();
        this.successMessage = 'Todo deleted successfully!';
      },
      (err: HttpErrorResponse) => {
        this.errorMessage = 'Failed to delete todo, please try again.';
        console.error('Delete Todo Error:', err);
      }
    );
  }

  editTodo(todo: Todo): void {
    this.newTodo = { ...todo };
  }

  saveTodo(): void {
    if (this.newTodo.id) {
      this.todoService.updateTodo(this.newTodo as Todo).subscribe(
        () => {
          this.getTodos();
          this.successMessage = 'Todo updated successfully!';
          this.showSaveMessage = true;
          setTimeout(() => (this.showSaveMessage = false), 3000);
          this.newTodo = { title: '', description: '', dueDate: new Date().toISOString(), status: 0, priority: 0 };
        },
        (error) => {
          console.error('Failed to save todo:', error);
          this.errorMessage = 'Failed to save todo, please try again.';
        }
      );
    } else {
      this.createTodo();
    }
  }
}
