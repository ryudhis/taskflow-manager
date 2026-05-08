import { describe, it, expect, beforeEach } from "vitest";
import { useFilterStore } from "./filter.store";

describe("Filter Store", () => {
  beforeEach(() => {
    useFilterStore.setState({
      filter: "all",
      searchKeyword: "",
      selectedIds: new Set<string>(),
    });
  });

  it("should have correct initial state", () => {
    const state = useFilterStore.getState();
    expect(state.filter).toBe("all");
    expect(state.searchKeyword).toBe("");
    expect(state.selectedIds.size).toBe(0);
  });

  it("should update filter", () => {
    useFilterStore.getState().setFilter("completed");
    expect(useFilterStore.getState().filter).toBe("completed");
  });

  it("should update search keyword", () => {
    useFilterStore.getState().setSearchKeyword("test");
    expect(useFilterStore.getState().searchKeyword).toBe("test");
  });

  it("should toggle selection", () => {
    useFilterStore.getState().toggleSelect("1");
    expect(useFilterStore.getState().selectedIds.has("1")).toBe(true);
    
    useFilterStore.getState().toggleSelect("1");
    expect(useFilterStore.getState().selectedIds.has("1")).toBe(false);
  });

  it("should select all", () => {
    useFilterStore.getState().selectAll(["1", "2", "3"]);
    expect(useFilterStore.getState().selectedIds.size).toBe(3);
    expect(useFilterStore.getState().selectedIds.has("1")).toBe(true);
  });

  it("should deselect all", () => {
    useFilterStore.getState().selectAll(["1", "2", "3"]);
    useFilterStore.getState().deselectAll();
    expect(useFilterStore.getState().selectedIds.size).toBe(0);
  });

  it("should clear selection", () => {
    useFilterStore.getState().selectAll(["1"]);
    useFilterStore.getState().clearSelection();
    expect(useFilterStore.getState().selectedIds.size).toBe(0);
  });
});
