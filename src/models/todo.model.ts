export interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: number;
  priority: number;
  createdDate: string;
  lastModifiedDate?: string;
  userId: string; // Added userId property
}
