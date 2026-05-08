import { z } from "zod/v4";

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, "Judul minimal 3 karakter")
    .max(100, "Judul maksimal 100 karakter"),
  description: z
    .string()
    .max(500, "Deskripsi maksimal 500 karakter"),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.union([z.string(), z.null()]),
});

export type TaskFormData = z.infer<typeof taskSchema>;
