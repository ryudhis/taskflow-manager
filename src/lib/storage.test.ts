import { describe, it, expect, beforeEach } from "vitest";
import { getItem, setItem, removeItem, STORAGE_KEYS } from "./storage";

describe("Storage Utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return null for non-existent key", () => {
    const value = getItem("non_existent_key");
    expect(value).toBeNull();
  });

  it("should return null for invalid JSON", () => {
    localStorage.setItem("invalid_json", "invalid_json_string");
    const value = getItem("invalid_json");
    expect(value).toBeNull();
  });

  it("should set and get an object successfully", () => {
    const testObj = { name: "test", value: 123 };
    setItem(STORAGE_KEYS.TASKS, testObj);
    const retrieved = getItem<typeof testObj>(STORAGE_KEYS.TASKS);
    expect(retrieved).toEqual(testObj);
  });

  it("should set and get a primitive successfully", () => {
    setItem("test_primitive", "hello");
    const retrieved = getItem<string>("test_primitive");
    expect(retrieved).toBe("hello");
  });

  it("should remove item successfully", () => {
    setItem("test_key", "value");
    removeItem("test_key");
    const retrieved = getItem("test_key");
    expect(retrieved).toBeNull();
  });
});
