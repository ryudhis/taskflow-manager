import { useMemo } from "react";
import type { Task } from "../../types";
import { useTasksQuery } from "../../hooks/useTasks";
import { useFilterStore } from "../../stores/filter.store";
import TaskCard from "./TaskCard";
import TaskEmptyState from "./TaskEmptyState";
import TaskListSkeleton from "./TaskListSkeleton";

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

export default function TaskList({ onEditTask }: TaskListProps) {
  const { data: tasks, isLoading, isError } = useTasksQuery();
  const { filter, searchKeyword } = useFilterStore();

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    let result = [...tasks];

    if (filter === "completed") {
      result = result.filter((t) => t.completed);
    } else if (filter === "incomplete") {
      result = result.filter((t) => !t.completed);
    }

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(keyword) ||
          t.description.toLowerCase().includes(keyword)
      );
    }

    return result;
  }, [tasks, filter, searchKeyword]);

  if (isLoading) {
    return <TaskListSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          Gagal memuat daftar tugas. Silakan refresh halaman.
        </p>
      </div>
    );
  }

  if (!filteredTasks.length) {
    if (tasks?.length && (filter !== "all" || searchKeyword)) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tidak ada tugas yang cocok dengan filter saat ini.
          </p>
        </div>
      );
    }
    return <TaskEmptyState />;
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEditTask} />
      ))}
    </div>
  );
}
