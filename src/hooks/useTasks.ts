import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as taskService from "../api/task.service";
import { useFilterStore } from "../stores/filter.store";
import type { Task, CreateTaskPayload, UpdateTaskPayload, ApiError } from "../types";

const TASKS_KEY = ["tasks"] as const;

export function useTasksQuery() {
  return useQuery({
    queryKey: TASKS_KEY,
    queryFn: async () => {
      const response = await taskService.getTasks();
      return response.data;
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => taskService.createTask(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY });
      const previous = queryClient.getQueryData<Task[]>(TASKS_KEY);

      const optimistic: Task = {
        id: "temp_" + Date.now(),
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        dueDate: payload.dueDate,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Task[]>(TASKS_KEY, (old) => [
        optimistic,
        ...(old ?? []),
      ]);

      return { previous };
    },
    onError: (_error: ApiError, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TASKS_KEY, context.previous);
      }
      toast.error("Gagal menambahkan tugas. Silakan coba lagi.");
    },
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTaskPayload) => taskService.updateTask(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY });
      const previous = queryClient.getQueryData<Task[]>(TASKS_KEY);

      queryClient.setQueryData<Task[]>(TASKS_KEY, (old) =>
        (old ?? []).map((task) =>
          task.id === payload.id
            ? { ...task, ...payload, updatedAt: new Date().toISOString() }
            : task
        )
      );

      return { previous };
    },
    onError: (_error: ApiError, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TASKS_KEY, context.previous);
      }
      toast.error("Gagal memperbarui tugas. Silakan coba lagi.");
    },
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY });
      const previous = queryClient.getQueryData<Task[]>(TASKS_KEY);

      queryClient.setQueryData<Task[]>(TASKS_KEY, (old) =>
        (old ?? []).filter((task) => task.id !== id)
      );

      return { previous };
    },
    onError: (_error: ApiError, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TASKS_KEY, context.previous);
      }
      toast.error("Gagal menghapus tugas. Silakan coba lagi.");
    },
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useBulkDelete() {
  const queryClient = useQueryClient();
  const clearSelection = useFilterStore((s) => s.clearSelection);

  return useMutation({
    mutationFn: (ids: string[]) => taskService.bulkDelete(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY });
      const previous = queryClient.getQueryData<Task[]>(TASKS_KEY);

      queryClient.setQueryData<Task[]>(TASKS_KEY, (old) =>
        (old ?? []).filter((task) => !ids.includes(task.id))
      );

      return { previous };
    },
    onError: (_error: ApiError, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TASKS_KEY, context.previous);
      }
      toast.error("Gagal menghapus tugas. Silakan coba lagi.");
    },
    onSuccess: (response) => {
      clearSelection();
      toast.success(response.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}

export function useBulkComplete() {
  const queryClient = useQueryClient();
  const clearSelection = useFilterStore((s) => s.clearSelection);

  return useMutation({
    mutationFn: (ids: string[]) => taskService.bulkComplete(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY });
      const previous = queryClient.getQueryData<Task[]>(TASKS_KEY);

      queryClient.setQueryData<Task[]>(TASKS_KEY, (old) =>
        (old ?? []).map((task) =>
          ids.includes(task.id)
            ? { ...task, completed: true, updatedAt: new Date().toISOString() }
            : task
        )
      );

      return { previous };
    },
    onError: (_error: ApiError, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TASKS_KEY, context.previous);
      }
      toast.error("Gagal memperbarui tugas. Silakan coba lagi.");
    },
    onSuccess: (response) => {
      clearSelection();
      toast.success(response.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}
