import { useState } from "react";
import type { Task } from "../types";
import AppLayout from "../components/layout/AppLayout";
import TaskForm from "../components/task/TaskForm";
import TaskList from "../components/task/TaskList";
import TaskEditModal from "../components/task/TaskEditModal";
import FilterBar from "../components/filter/FilterBar";
import BulkActionBar from "../components/bulk/BulkActionBar";

export default function DashboardPage() {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Kelola dan pantau semua tugas Anda di satu tempat.
          </p>
        </div>

        <TaskForm />

        <FilterBar />

        <TaskList onEditTask={(task) => setEditingTask(task)} />
      </div>

      <TaskEditModal
        task={editingTask}
        isOpen={editingTask !== null}
        onClose={() => setEditingTask(null)}
      />

      <BulkActionBar />
    </AppLayout>
  );
}
