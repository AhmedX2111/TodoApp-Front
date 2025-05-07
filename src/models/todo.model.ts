export interface Todo {
  id: string;
  title: string;
  description: string;
  status: number;
  priority: number;
  dueDate: string;
  createdDate: string;
  lastModifiedDate?: string;
}
