export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
}

export interface UpdateTaskPayload {
  id: string;
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string | null;
  completed?: boolean;
}

export type TaskFilter = "all" | "completed" | "incomplete";

export type Theme = "light" | "dark" | "system";

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface ApiError {
  message: string;
  status: number;
}
