import { Component, OnInit } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];

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
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data;
    });
  }

  createTodo(): void {
    // Create a valid Todo object that matches the backend API structure
    const validTodo: Partial<Todo> = {
      title: this.newTodo.title!.trim(),
      description: this.newTodo.description ?? '',
      dueDate: new Date(this.newTodo.dueDate!).toISOString(),
      status: 0, // TodoStatus.Pending (0 represents Pending)
      priority: this.newTodo.priority, // Directly using the priority value (already a number)
    };
  
    // Call the Todo service to create the new todo
    this.todoService.createTodo(validTodo).subscribe({
      next: () => {
        this.getTodos();  // Refresh the todo list after successful creation
        // Reset the form data
        this.newTodo = {
          title: '',
          description: '',
          dueDate: new Date().toISOString(),
          status: 0,   // Reset to default Pending status
          priority: 1, // Reset to default Medium priority
        };
      },
      error: (err) => {
        console.error('Failed to create todo', err);  // Log any errors
      }
    });
  }

  updateTodoStatus(id: string): void {
    this.todoService.markAsComplete(id).subscribe(() => {
      this.getTodos();
    });
  }

  deleteTodo(id: string): void {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.getTodos();
    });
  }
}
