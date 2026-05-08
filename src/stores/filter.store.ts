import { create } from "zustand";
import type { TaskFilter } from "../types";

interface FilterState {
  filter: TaskFilter;
  searchKeyword: string;
  selectedIds: Set<string>;
  setFilter: (filter: TaskFilter) => void;
  setSearchKeyword: (keyword: string) => void;
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  deselectAll: () => void;
  clearSelection: () => void;
}

export const useFilterStore = create<FilterState>()((set) => ({
  filter: "all",
  searchKeyword: "",
  selectedIds: new Set<string>(),
  setFilter: (filter) => set({ filter }),
  setSearchKeyword: (searchKeyword) => set({ searchKeyword }),
  toggleSelect: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { selectedIds: next };
    }),
  selectAll: (ids) => set({ selectedIds: new Set(ids) }),
  deselectAll: () => set({ selectedIds: new Set<string>() }),
  clearSelection: () => set({ selectedIds: new Set<string>() }),
}));
