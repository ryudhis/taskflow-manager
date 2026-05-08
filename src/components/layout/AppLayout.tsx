import type { ReactNode } from "react";
import Header from "./Header";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
