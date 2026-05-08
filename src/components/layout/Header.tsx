import { useLogout } from "../../hooks/useAuth";
import { useAuthStore } from "../../stores/auth.store";
import { useThemeStore } from "../../stores/theme.store";
import type { Theme } from "../../types";
import Button from "../ui/Button";

const themeOptions: { value: Theme; icon: string }[] = [
  { value: "light", icon: "☀️" },
  { value: "dark", icon: "🌙" },
  { value: "system", icon: "💻" },
];

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const { theme, setTheme } = useThemeStore();

  const cycleTheme = () => {
    const currentIndex = themeOptions.findIndex((t) => t.value === theme);
    const next = themeOptions[(currentIndex + 1) % themeOptions.length];
    setTheme(next.value);
  };

  const currentThemeIcon =
    themeOptions.find((t) => t.value === theme)?.icon ?? "💻";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 dark:bg-violet-500">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            TaskFlow
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={cycleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={`Tema: ${theme}`}
          >
            {currentThemeIcon}
          </button>

          {user && (
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {user.name}
              </span>
            </div>
          )}

          <Button variant="ghost" size="sm" onClick={logout}>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
