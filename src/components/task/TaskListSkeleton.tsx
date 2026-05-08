function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-2 pt-0.5">
          <div className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-full bg-slate-100 dark:bg-slate-800" />
            <div className="h-5 w-20 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TaskListSkeleton() {
  return (
    <div className="space-y-3">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
