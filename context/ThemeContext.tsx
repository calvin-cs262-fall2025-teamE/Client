import React, { createContext, ReactNode, useContext, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  background: readonly [string, string, string];
  surface: string;
  surfaceElev: string;
  text: string;
  textSecondary: string;
  primary: string;
  accent: string;
  border: string;
  chip: string;
  cardBackground: string;
}

interface Theme {
  colors: ThemeColors;
  radii: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    pill: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const darkTheme: Theme = {
  colors: {
    background: ["#0a0a0a", "#0f0f0f", "#121212"] as const,
    surface: "#1a1a1a",
    surfaceElev: "#242424",
    text: "#FFFFFF",
    textSecondary: "#A0A0A0",
    primary: "#FF8A80",
    accent: "#FF6B6B",
    border: "#333333",
    chip: "rgba(255,255,255,0.08)",
    cardBackground: "#1a1a1a",
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

const lightTheme: Theme = {
  colors: {
    background: ["#f5f7fa", "#ffffff", "#fafbfc"] as const,
    surface: "#ffffff",
    surfaceElev: "#f0f2f5",
    text: "#1a1a2e",
    textSecondary: "#6b7280",
    primary: "#e63946",
    accent: "#ff6b6b",
    border: "#e5e7eb",
    chip: "rgba(0,0,0,0.04)",
    cardBackground: "#ffffff",
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
