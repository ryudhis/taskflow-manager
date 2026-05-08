import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormData } from "../../schemas/task.schema";
import { useCreateTask } from "../../hooks/useTasks";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const priorityOptions = [
  { value: "low", label: "Rendah" },
  { value: "medium", label: "Sedang" },
  { value: "high", label: "Tinggi" },
];

export default function TaskForm() {
  const createTask = useCreateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: null,
    },
  });

  const onSubmit = (data: TaskFormData) => {
    createTask.mutate(
      {
        title: data.title,
        description: data.description || "",
        priority: data.priority,
        dueDate: data.dueDate || null,
      },
      {
        onSuccess: () => reset(),
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">
        Tambah Tugas Baru
      </h2>

      <div className="space-y-4">
        <Input
          label="Judul"
          placeholder="Masukkan judul tugas..."
          error={errors.title?.message}
          {...register("title")}
        />

        <Input
          label="Deskripsi"
          placeholder="Deskripsi tugas (opsional)..."
          error={errors.description?.message}
          {...register("description")}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Prioritas"
            options={priorityOptions}
            error={errors.priority?.message}
            {...register("priority")}
          />

          <Input
            label="Tenggat Waktu"
            type="date"
            error={errors.dueDate?.message}
            {...register("dueDate")}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" isLoading={createTask.isPending}>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Tambah Tugas
          </Button>
        </div>
      </div>
    </form>
  );
}
