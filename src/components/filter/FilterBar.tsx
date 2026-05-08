import { useFilterStore } from "../../stores/filter.store";
import type { TaskFilter } from "../../types";
import SearchInput from "./SearchInput";

const filterOptions: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "completed", label: "Selesai" },
  { value: "incomplete", label: "Belum Selesai" },
];

export default function FilterBar() {
  const { filter, setFilter } = useFilterStore();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 cursor-pointer ${
              filter === opt.value
                ? "bg-violet-600 text-white shadow-sm dark:bg-violet-500"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="w-full sm:w-72">
        <SearchInput />
      </div>
    </div>
  );
}
