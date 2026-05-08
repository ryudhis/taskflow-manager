import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskFormData } from "../../schemas/task.schema";
import { useUpdateTask } from "../../hooks/useTasks";
import type { Task } from "../../types";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

interface TaskEditModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

const priorityOptions = [
  { value: "low", label: "Rendah" },
  { value: "medium", label: "Sedang" },
  { value: "high", label: "Tinggi" },
];

export default function TaskEditModal({ task, isOpen, onClose }: TaskEditModalProps) {
  const updateTask = useUpdateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    if (task && isOpen) {
      reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
      });
    }
  }, [task, isOpen, reset]);

  const onSubmit = (data: TaskFormData) => {
    if (!task) return;

    updateTask.mutate(
      {
        id: task.id,
        title: data.title,
        description: data.description || "",
        priority: data.priority,
        dueDate: data.dueDate || null,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Tugas">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" isLoading={updateTask.isPending}>
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
