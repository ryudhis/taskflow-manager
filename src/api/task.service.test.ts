import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  bulkDelete,
  bulkComplete,
} from "./task.service";
import type { CreateTaskPayload } from "../types";

describe("Task Service", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const runAllTimers = async () => {
    await vi.runAllTimersAsync();
  };

  it("should get empty tasks initially", async () => {
    const promise = getTasks();
    await runAllTimers();
    const response = await promise;
    expect(response.data).toEqual([]);
    expect(response.message).toBe("Berhasil mengambil daftar tugas");
  });

  it("should create a task successfully", async () => {
    const payload: CreateTaskPayload = {
      title: "Test Task",
      description: "Test Description",
      priority: "high",
      dueDate: "2026-05-15",
    };

    const promise = createTask(payload);
    await runAllTimers();
    const response = await promise;

    expect(response.data.title).toBe("Test Task");
    expect(response.data.completed).toBe(false);
    expect(response.message).toBe("Tugas berhasil ditambahkan");

    const getPromise = getTasks();
    await runAllTimers();
    const getResponse = await getPromise;
    expect(getResponse.data).toHaveLength(1);
    expect(getResponse.data[0].id).toBe(response.data.id);
  });

  it("should throw error randomly if Math.random < 0.05", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.01);
    
    let error: any;
    createTask({
      title: "Fail Task",
      description: "",
      priority: "low",
      dueDate: null,
    }).catch(e => { error = e; });
    
    await runAllTimers();
    expect(error).toEqual({
      message: "Terjadi kesalahan server. Silakan coba lagi.",
      status: 500,
    });
  });

  it("should update a task successfully", async () => {
    const createPromise = createTask({
      title: "Original",
      description: "",
      priority: "medium",
      dueDate: null,
    });
    await runAllTimers();
    const task = (await createPromise).data;

    const updatePromise = updateTask({
      id: task.id,
      title: "Updated",
      completed: true,
    });
    await runAllTimers();
    const updatedResponse = await updatePromise;

    expect(updatedResponse.data.title).toBe("Updated");
    expect(updatedResponse.data.completed).toBe(true);
    expect(updatedResponse.message).toBe("Tugas berhasil diperbarui");
  });

  it("should throw 404 when updating non-existent task", async () => {
    let error: any;
    updateTask({ id: "invalid_id", title: "New" }).catch(e => { error = e; });
    await runAllTimers();
    expect(error).toEqual({
      message: "Tugas tidak ditemukan",
      status: 404,
    });
  });

  it("should delete a task successfully", async () => {
    const createPromise = createTask({
      title: "To Delete",
      description: "",
      priority: "medium",
      dueDate: null,
    });
    await runAllTimers();
    const task = (await createPromise).data;

    const deletePromise = deleteTask(task.id);
    await runAllTimers();
    const deleteResponse = await deletePromise;
    
    expect(deleteResponse.data).toBeNull();
    expect(deleteResponse.message).toBe("Tugas berhasil dihapus");

    const getPromise = getTasks();
    await runAllTimers();
    expect((await getPromise).data).toHaveLength(0);
  });

  it("should throw 404 when deleting non-existent task", async () => {
    let error: any;
    deleteTask("invalid_id").catch(e => { error = e; });
    await runAllTimers();
    expect(error).toEqual({
      message: "Tugas tidak ditemukan",
      status: 404,
    });
  });

  it("should perform bulk delete successfully", async () => {
    const p1 = createTask({ title: "Task1", description: "", priority: "low", dueDate: null });
    await runAllTimers();
    const t1 = (await p1).data;

    const p2 = createTask({ title: "Task2", description: "", priority: "low", dueDate: null });
    await runAllTimers();
    const t2 = (await p2).data;

    const bdPromise = bulkDelete([t1.id, t2.id]);
    await runAllTimers();
    await bdPromise;

    const getPromise = getTasks();
    await runAllTimers();
    expect((await getPromise).data).toHaveLength(0);
  });

  it("should perform bulk complete successfully", async () => {
    const p1 = createTask({ title: "Task1", description: "", priority: "low", dueDate: null });
    await runAllTimers();
    const t1 = (await p1).data;

    const p2 = createTask({ title: "Task2", description: "", priority: "low", dueDate: null });
    await runAllTimers();
    const t2 = (await p2).data;

    const bcPromise = bulkComplete([t1.id, t2.id]);
    await runAllTimers();
    const response = await bcPromise;

    expect(response.data.every(t => t.completed === true)).toBe(true);

    const getPromise = getTasks();
    await runAllTimers();
    const allTasks = (await getPromise).data;
    expect(allTasks.every(t => t.completed === true)).toBe(true);
  });
});
