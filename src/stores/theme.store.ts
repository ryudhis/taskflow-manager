import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "../types";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", isDark);
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    {
      name: "taskflow_theme",
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);

function handleSystemThemeChange(): void {
  const state = useThemeStore.getState();
  if (state.theme === "system") {
    applyTheme("system");
  }
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", handleSystemThemeChange);
