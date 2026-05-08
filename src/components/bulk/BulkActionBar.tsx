import { useMemo } from "react";
import { useFilterStore } from "../../stores/filter.store";
import { useTasksQuery, useBulkDelete, useBulkComplete } from "../../hooks/useTasks";
import Button from "../ui/Button";

export default function BulkActionBar() {
  const { selectedIds, selectAll, deselectAll } = useFilterStore();
  const { data: tasks } = useTasksQuery();
  const bulkDelete = useBulkDelete();
  const bulkComplete = useBulkComplete();

  const { filter, searchKeyword } = useFilterStore();

  const filteredTaskIds = useMemo(() => {
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

    return result.map((t) => t.id);
  }, [tasks, filter, searchKeyword]);

  const selectedCount = selectedIds.size;
  const allSelected =
    filteredTaskIds.length > 0 && filteredTaskIds.every((id) => selectedIds.has(id));

  if (selectedCount === 0) return null;

  const handleSelectAll = () => {
    if (allSelected) {
      deselectAll();
    } else {
      selectAll(filteredTaskIds);
    }
  };

  const handleBulkDelete = () => {
    bulkDelete.mutate(Array.from(selectedIds));
  };

  const handleBulkComplete = () => {
    bulkComplete.mutate(Array.from(selectedIds));
  };

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in slide-in-from-bottom-4 fade-in duration-200">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {selectedCount} dipilih
        </span>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />

        <button
          onClick={handleSelectAll}
          className="text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors cursor-pointer"
        >
          {allSelected ? "Batalkan Semua" : "Pilih Semua"}
        </button>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />

        <Button
          variant="secondary"
          size="sm"
          onClick={handleBulkComplete}
          isLoading={bulkComplete.isPending}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Selesaikan
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={handleBulkDelete}
          isLoading={bulkDelete.isPending}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          Hapus
        </Button>
      </div>
    </div>
  );
}
