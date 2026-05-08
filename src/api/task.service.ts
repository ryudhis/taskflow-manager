import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  ApiResponse,
  ApiError,
} from "../types";
import { getItem, setItem, STORAGE_KEYS } from "../lib/storage";

function delay(): Promise<void> {
  const duration = Math.floor(Math.random() * 200) + 800;
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function maybeThrowError(): void {
  if (Math.random() < 0.05) {
    const error: ApiError = {
      message: "Terjadi kesalahan server. Silakan coba lagi.",
      status: 500,
    };
    throw error;
  }
}

function generateId(): string {
  return "task_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
}

function getAllTasks(): Task[] {
  return getItem<Task[]>(STORAGE_KEYS.TASKS) ?? [];
}

function saveTasks(tasks: Task[]): void {
  setItem(STORAGE_KEYS.TASKS, tasks);
}

export async function getTasks(): Promise<ApiResponse<Task[]>> {
  await delay();
  const tasks = getAllTasks();
  return {
    data: tasks,
    message: "Berhasil mengambil daftar tugas",
  };
}

export async function createTask(
  payload: CreateTaskPayload
): Promise<ApiResponse<Task>> {
  await delay();
  maybeThrowError();

  const now = new Date().toISOString();
  const newTask: Task = {
    id: generateId(),
    title: payload.title,
    description: payload.description,
    priority: payload.priority,
    dueDate: payload.dueDate,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  const tasks = getAllTasks();
  tasks.unshift(newTask);
  saveTasks(tasks);

  return {
    data: newTask,
    message: "Tugas berhasil ditambahkan",
  };
}

export async function updateTask(
  payload: UpdateTaskPayload
): Promise<ApiResponse<Task>> {
  await delay();
  maybeThrowError();

  const tasks = getAllTasks();
  const index = tasks.findIndex((t) => t.id === payload.id);

  if (index === -1) {
    const error: ApiError = {
      message: "Tugas tidak ditemukan",
      status: 404,
    };
    throw error;
  }

  const updated: Task = {
    ...tasks[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  tasks[index] = updated;
  saveTasks(tasks);

  return {
    data: updated,
    message: "Tugas berhasil diperbarui",
  };
}

export async function deleteTask(id: string): Promise<ApiResponse<null>> {
  await delay();
  maybeThrowError();

  const tasks = getAllTasks();
  const filtered = tasks.filter((t) => t.id !== id);

  if (filtered.length === tasks.length) {
    const error: ApiError = {
      message: "Tugas tidak ditemukan",
      status: 404,
    };
    throw error;
  }

  saveTasks(filtered);

  return {
    data: null,
    message: "Tugas berhasil dihapus",
  };
}

export async function bulkDelete(
  ids: string[]
): Promise<ApiResponse<null>> {
  await delay();
  maybeThrowError();

  const tasks = getAllTasks();
  const filtered = tasks.filter((t) => !ids.includes(t.id));
  saveTasks(filtered);

  return {
    data: null,
    message: `${ids.length} tugas berhasil dihapus`,
  };
}

export async function bulkComplete(
  ids: string[]
): Promise<ApiResponse<Task[]>> {
  await delay();
  maybeThrowError();

  const tasks = getAllTasks();
  const now = new Date().toISOString();
  const updatedTasks: Task[] = [];

  const result = tasks.map((t) => {
    if (ids.includes(t.id)) {
      const updated = { ...t, completed: true, updatedAt: now };
      updatedTasks.push(updated);
      return updated;
    }
    return t;
  });

  saveTasks(result);

  return {
    data: updatedTasks,
    message: `${ids.length} tugas ditandai selesai`,
  };
}
