import { describe, it, expect, beforeEach } from "vitest";
import { useThemeStore } from "./theme.store";

describe("Theme Store", () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: "system" });
    document.documentElement.className = "";
  });

  it("should have correct initial state", () => {
    const state = useThemeStore.getState();
    expect(state.theme).toBe("system");
  });

  it("should apply dark theme directly", () => {
    useThemeStore.getState().setTheme("dark");
    expect(useThemeStore.getState().theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should apply light theme directly", () => {
    document.documentElement.classList.add("dark");
    useThemeStore.getState().setTheme("light");
    expect(useThemeStore.getState().theme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("should apply system theme dynamically", () => {
    useThemeStore.getState().setTheme("system");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
