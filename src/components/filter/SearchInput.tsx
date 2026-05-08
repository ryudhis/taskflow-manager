import { useState, useEffect } from "react";
import { useFilterStore } from "../../stores/filter.store";

export default function SearchInput() {
  const { searchKeyword, setSearchKeyword } = useFilterStore();
  const [localValue, setLocalValue] = useState(searchKeyword);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(localValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue, setSearchKeyword]);

  useEffect(() => {
    setLocalValue(searchKeyword);
  }, [searchKeyword]);

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Cari tugas..."
        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-violet-400/20 dark:focus:border-violet-400"
      />
      {localValue && (
        <button
          onClick={() => setLocalValue("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
