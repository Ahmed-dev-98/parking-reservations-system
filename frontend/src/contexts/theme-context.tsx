"use client";

import { ELOCAL_STORAGE_KEYS } from "@/constants/cache-storage-keys";
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Wait for hydration to complete before accessing client-side APIs
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check system preference (only after mounting)
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mounted]);

  // Load theme from localStorage on mount (only after mounting)
  useEffect(() => {
    if (!mounted) return;

    const stored = localStorage.getItem(ELOCAL_STORAGE_KEYS.THEME) as Theme;
    if (stored && ["light", "dark", "system"].includes(stored)) {
      setThemeState(stored);
    }
  }, [mounted]);

  // Apply theme to document (only after mounting)
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme, systemTheme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (mounted && typeof window !== "undefined") {
      localStorage.setItem(ELOCAL_STORAGE_KEYS.THEME, newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, systemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
