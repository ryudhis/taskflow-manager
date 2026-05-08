import type { Task } from "../../types";
import { useUpdateTask, useDeleteTask } from "../../hooks/useTasks";
import { useFilterStore } from "../../stores/filter.store";
import Badge from "../ui/Badge";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const priorityConfig = {
  low: { label: "Rendah", variant: "info" as const },
  medium: { label: "Sedang", variant: "warning" as const },
  high: { label: "Tinggi", variant: "danger" as const },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { selectedIds, toggleSelect } = useFilterStore();
  const isSelected = selectedIds.has(task.id);
  const priority = priorityConfig[task.priority];

  const handleToggleComplete = () => {
    updateTask.mutate({ id: task.id, completed: !task.completed });
  };

  const handleDelete = () => {
    deleteTask.mutate(task.id);
  };

  return (
    <div
      className={`group relative rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-2 ${
        isSelected
          ? "border-violet-300 bg-violet-50/50 dark:border-violet-700 dark:bg-violet-950/20"
          : "border-slate-200 dark:border-slate-800"
      } ${task.completed ? "opacity-75" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-2 pt-0.5">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleSelect(task.id)}
            className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/20 dark:border-slate-600 dark:bg-slate-800 cursor-pointer accent-violet-600"
          />
          <button
            onClick={handleToggleComplete}
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200 cursor-pointer ${
              task.completed
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-slate-300 hover:border-emerald-400 dark:border-slate-600"
            }`}
          >
            {task.completed && (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3
                className={`text-sm font-medium transition-all duration-200 ${
                  task.completed
                    ? "text-slate-400 line-through dark:text-slate-500"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(task)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:text-violet-400 dark:hover:bg-violet-950/50 transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant={priority.variant}>{priority.label}</Badge>
            <Badge variant={task.completed ? "success" : "default"}>
              {task.completed ? "Selesai" : "Belum Selesai"}
            </Badge>
            {task.dueDate && (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                📅 {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
